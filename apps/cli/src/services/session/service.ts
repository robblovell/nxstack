import { Session as SessionContract } from '../contracts'
import { SessionParams } from '../params'
import { Service } from '../base'
import { Session } from './session'
import { createDebug } from '@c6o/logger'

const debug = createDebug()

export abstract class SessionService<P extends SessionParams = SessionParams> extends Service<P> {
    session: SessionContract
    abstract signature: string
    protected abstract sessionInProgress(): Promise<boolean>
    protected abstract executeCleanup(): Promise<boolean>
    protected abstract execute(): Promise<void>

    async ensureSession() {
        if (this.session) return
        this.session = new Session(this.signature)
        await this.session.lock()
    }

    async cleanUp(endSession = true) {
        await this.ensureSession()
        endSession = await this.executeCleanup() && endSession
        if (endSession) {
            // TODO: Decide if this should only be done at the composite service level.
            // await recordMetricsDuration(this.session, this.params)
            await this.session.dispose()
            delete this.session
        }
        else {
            await this.session.release()
        }
    }

    async perform() {
        await this.ensureSession()

        if (this.params.clean)
            return await this.cleanUp(true)

        if (await this.sessionInProgress())
            throw Error('A session with this same signature is already running.\nTry: clean it up first by adding \'--clean\' parameter to this command or run \'czctl session close\'')

        try {
            await this.execute()
        }
        catch(e) {
            debug('ERROR %o', e)
            await this.cleanUp(true)
            throw e
        }
        finally {
            // TODO: Decide if this should only be done at the composite service level, maybe make this optional for the individual service?
            //@ts-ignore
            // await recordMetricsDuration(this.session, this.params, this.params,Object.getPrototypeOf(this).constructor.name)
            this.session?.release()
            delete this.session
        }
    }
}
