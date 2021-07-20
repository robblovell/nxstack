import hash from 'object-hash'
import * as Sentry from '@sentry/node'
import { Service } from '../base'
import { SessionParams } from '../params'
import { createDebug } from '@c6o/logger'
import { Factory } from '../../orchestrators/factory'
import { Session } from './session'
import { Session as SessionContract } from '../contracts'
import { recordMetricsDuration } from '../../instrumentation/duration'

const debug = createDebug()

export interface SessionDescription<P extends SessionParams = SessionParams> {
    display: string
    handler?: string
    signatures?: string[]
    cleanUpParams?: P
}

export interface SubService {
    signature: string
    session: SessionContract
    cleanUp(endSession: boolean): Promise<void>
}

export interface CleanupHandler {
    apply(): Promise<void>
}

/**
 * A composite session service uses one or more session service
 * to perform a function.
 */
export abstract class CompositeService<P extends SessionParams> extends Service<P>  {
    protected abstract execute(): Promise<void>
    protected abstract toDescription(): Promise<SessionDescription<P>>
    private handlerName: string
    private subServices: SubService[]

    registerForCleanup(subService: SubService) {
        this.subServices.push(subService)
    }

    get signatures() {
        const signature = this.subServices
            //.filter(subService => !subService.session.shared)
            .map(subService => subService.signature) // return array of signatures.

        return signature
    }

    private async getSession() {
        const uniqueId = hash([
            this.handlerName,
            ...this.signatures
        ])
        const session = new Session(uniqueId)
        await session.lock()
        return session
    }

    private async postProcess() {
        if (this.subServices.length === 0)
            throw new Error('Service did not register any sub-services')

        const session = await this.getSession()
        if (this.params.clean) {
            await recordMetricsDuration(session, this.params)
            return await session.dispose()
        }
        const description = await this.toDescription()
        description.cleanUpParams.clean = true
        description.handler = this.handlerName
        description.signatures = this.signatures
        session.setDescription(description)
        await recordMetricsDuration(session, this.params, this.handlerName)
        session.release()
    }

    async perform(handlerName: keyof typeof Factory) {
        this.subServices = []
        this.handlerName = handlerName

        try {
            await this.execute()
        }
        catch(ex) {
            await this.cleanUp()
            throw ex
        }

        await this.postProcess()

        if (this.params.wait)
            await this.wait()
    }

    private async cleanUp(disposeSession = false) {
        try {
            for(const service of this.subServices)
                await service.cleanUp(true)
        }
        finally {
            const session = await this.getSession()
            if (disposeSession) {
                await session.dispose()
            }
            else {
                await session.release()
            }
        }
    }

    async wait() {
        this.status?.warn('Waiting for CTRL-C to exit')
        debug('Waiting for CTRL-C %o')

        process.stdin.resume()

        process.on('SIGINT', async () => {
            debug('Processing SIGINT')

            let exitCode = 0
            try {
                await this.cleanUp(true)
            }
            catch(err) {
                debug('ERROR %o', err)
                Sentry.captureException(err)
                exitCode = 1
            }
            finally {
                process.exit(exitCode)
            }
        })

        return new Promise(resolve => setInterval(resolve, 99999999))
    }
}
