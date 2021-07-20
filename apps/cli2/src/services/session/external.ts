import { createDebug } from '@c6o/logger'
import { ChildProcess, fork, spawn } from 'child_process'
import { SessionParams } from '../params'
import { SessionService } from './service'
import * as semver from 'semver'

const debug = createDebug()

export abstract class ExternalService<P extends SessionParams = SessionParams> extends SessionService<P> {
    static cleanUpKeys = ['child-pid']

    protected child: ChildProcess

    protected cleanUpMessage(hasDependant: boolean) {
        return hasDependant ?
            `Leaving service ${this.constructor.name} untouched` :
            `Cleaning up service ${this.constructor.name}`
    }

    async sessionInProgress() {
        return await this.session.any(ExternalService.cleanUpKeys)
    }

    protected async executeCleanup(): Promise<boolean> {
        const hasDependant = (await this.session.dependantCount()) > 1
        return await super.wrapStatus(this.cleanUpMessage(hasDependant), async () => {
            if (hasDependant)
                return false // There are a number of dependant sessions so do not shut down

            const pid = await this.session.get<number>('child-pid')
            if (pid) {
                try {
                    debug('cleaning pid %d', pid)
                    const success = process.kill(pid)
                    debug('cleaning pid %d result %o', pid, success)
                }
                catch (err) {
                    // If the process no longer exists,
                    // we get an exception which we have to suppress
                }
            }
            return await this.performForegroundCleanup()
        })
    }

    protected async performBackground() {
        throw new Error('performBackground not overridden')
    }

    protected async performForeground(): Promise<void> {
        throw new Error('performForeground not overridden')
    }

    protected async performForegroundCleanup(): Promise<boolean> {
        return true
    }

    protected async performBackgroundWrapper(): Promise<void> {
        const warningTimer = setTimeout(() => {
            debug('Child has not resolved within 5 seconds')
        }, 5000)

        // nodejs dies when an await chokes the event loop
        // timers prevent this
        const timer = setTimeout(() => { null }, 999999)

        try {
            await this.performBackground()
        }
        finally {
            clearTimeout(timer)
            clearTimeout(warningTimer)
        }
    }

    async execute() {
        if (this.params.wait)
            await this.performForeground()
        else
            await this.performBackgroundWrapper()
    }

    protected async spawner(command: string, awaitMessage: boolean, ...args: string[]) {
        if (this.child)
            throw Error('Child has already been spawned')

        return new Promise<void>((resolve, reject) => {

            this.child = spawn(command, args, {
                env: process.env,
                detached: true,
                stdio: 'ignore'
            })

            this.onChildCreated(awaitMessage, resolve, reject)
        })
    }

    protected async forker(pathToChild: string, awaitMessage: boolean, ...args: string[]) {
        if (this.child)
            throw Error('Child has already been spawned')

        return new Promise<void>((resolve, reject) => {

            this.child = fork(pathToChild, args, {
                detached: true,
                stdio: 'inherit'
            })

            this.onChildCreated(awaitMessage, resolve, reject)
        })
    }

    protected onChildCreated(awaitMessage: boolean, resolve, reject) {
        const onSpawn = async () => {
            await this.session.set('child-pid', this.child.pid)
            await this.onSpawn()
            if (!awaitMessage) {
                this.detach()
                resolve()
            }
        }

        if (semver.gte(process.version, '14.17.0')) {
            // 'spawn' event introduced in 14.17.0 and later
            this.child.on('spawn', onSpawn)
        } else {
            // Work around when 'spawn' event does not exist.
            // See: https://github.com/nodejs/node/issues/35288
            setTimeout(onSpawn, 500)
        }

        this.child.on('message', async (args: any) => {
            if (args.error) {
                this.detach()
                reject(args.error)
            } else {
                await this.onMessage(args)
                if (awaitMessage) {
                    this.detach()
                    resolve()
                }
            }
        })

        this.child.on('error', async (err) => {
            debug('ERROR from child %o', err)
            this.detach()
            reject(new Error('Child experienced an error'))
        })

        this.child.on('exit', async _ => {
            debug('exit child')
            reject(new Error('Child exited unexpectedly'))
        })
    }

    protected async onSpawn() {
        debug('spawner spawned successfully')
    }

    protected async onMessage(msg: any) {
        debug('Message received %o', msg)
    }

    protected detach() {
        this.child.disconnect?.()
        this.child.unref()
    }
}
