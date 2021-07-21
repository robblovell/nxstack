import hash from 'object-hash'
import { ChildProcess, spawn, SpawnOptions } from 'child_process'
import { keyValue } from '@c6o/kubeclient-contracts'
import {SessionService} from './session'
import {SessionParams} from './params'

export interface ShellerParams extends SessionParams {
    envKeys?: keyValue
    shellCloseHandler?: (...args: any[]) => void
}

export class Sheller extends SessionService<ShellerParams> {

    shell: ChildProcess = null
    get signature() { return `spawn-sheller-${hash(this.params.envKeys)}` }

    protected execute(): Promise<void> {
        const userShell = process.env.SHELL || '/bin/sh'
        const shellOptions: SpawnOptions = {
            shell: true,
            stdio: 'inherit',
            env: {
                ...process.env, // add the current environment to the shell.
                ...this.params.envKeys,
            }
        }

        this.shell = spawn(userShell, [], shellOptions)
        return
    }

    protected async executeCleanup(): Promise<boolean> {
        if (this.shell.killed) return false
        await this.shell.kill()
        return true
    }

    protected async sessionInProgress(): Promise<boolean> {
        return !!this.shell && !this.shell.killed
    }

    public on(event: string | symbol, listener: (...args: any[]) => void) {
        this.shell.on(event as string, listener)
        return this
    }
}