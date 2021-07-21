import { Status } from '@c6o/kubeclient-contracts'
import { EventEmitter } from 'events'
import pkgDir from 'pkg-dir'

export const projectBaseDir = pkgDir.sync(__dirname)

export interface ServiceParams {
    status?: Status
}
export class Service<P extends ServiceParams> extends EventEmitter {
    protected status: Status

    constructor(public params: P) {
        super()
        this.status = params.status
    }

    async wrapStatus<T>(message: string, promiseOrFb: Promise<T> | (() => Promise<T>)) {

        // Suppress status stuff if message is undefined
        // or an empty string
        const status = message ?
            this.params.status :
            undefined

        status?.push(message)
        try {
            return typeof promiseOrFb === 'function' ?
                await promiseOrFb() :
                await promiseOrFb
        }
        catch(e) {
            status?.error(e)
            throw e
        }
        finally {
            status?.pop()
        }
    }
}
