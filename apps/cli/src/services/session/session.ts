import { createDebug } from '@c6o/logger'
import hash from 'object-hash'
import {
    ClusterSessionOptions,
    LockingSessionStorage,
    LocksLocationClass,
} from './storage/contracts'
import { Session as SessionContract } from '../contracts'
import { SessionDescription } from './composite'
import { FileSessionStorage } from './storage/file'
import { ClusterSessionStorage } from './storage/cluster'

const debug = createDebug()

export interface SessionOptions {
    storageClass?: LocksLocationClass
}

const isFileStorage = (storage: LockingSessionStorage): storage is FileSessionStorage => {
    return typeof (storage as FileSessionStorage).list === 'function'
}
export class Session implements SessionContract {

    // Be careful here, the descriptionKey is shared across all instances.
    static descriptionKey = 'session-description'
    // todo: make this protected:
    public config = {}

    protected _signatureHash
    get signatureHash() {
        if (this._signatureHash) return this._signatureHash
        return this._signatureHash = hash(this.signature)
    }

    constructor(readonly signature: string, protected lockStorage?: LockingSessionStorage) {
        this.lockStorage = this.lockStorage || new FileSessionStorage(this.signatureHash)
    }

    static async subSessionList(options: ClusterSessionOptions): Promise<string[]> {
        return [
            ...await FileSessionStorage.subSessionList(),
            ...await ClusterSessionStorage.subSessionList(options)
        ]
    }

    static async purge(options: ClusterSessionOptions): Promise<void> {
        debug('purge %o', options)
        await FileSessionStorage.purge()

        // Do not purge cluster sessions
        // if (options.namespace)
        //     await ClusterSessionStorage.purge(options)
    }

    setDescription = async (value: any) => await this.set(Session.descriptionKey, value)

    async dependantCount() {
        let count = 0
        if (isFileStorage(this.lockStorage)) {
            const sessions = await this.lockStorage.list() as SessionDescription[]
            for (const session of sessions) {
                if (session.signatures.includes(this.signature))
                    count++
            }
        }
        return count
    }

    protected ensureAlive() {
        if (this.lockStorage.disposed())
            throw new Error('Attempt to use a disposed session')
    }

    async lock() {
        this.ensureAlive()
        const storageIsNew = await this.lockStorage.ensure(this.config)

        await this.lockStorage.lock()
        this.config = await this.lockStorage.load()
        return storageIsNew
    }

    async release() {
        await this.lockStorage.release()
        debug('released session %s', this.signature)
    }

    async dispose() {
        this.ensureAlive()
        await this.lockStorage.dispose()
        debug('disposed session %s', this.signature)
    }
    async any(items: any[]): Promise<boolean> {
        this.ensureAlive()
        const keys = Object.keys(this.config)
        // debug('any %o %o', items, keys)
        return !!keys.length && keys.some(a => items.includes(a))
    }

    async set(key: string, value: any) {
        this.ensureAlive()
        this.config[key] = value
        await this.lockStorage.save(this.config)
    }

    async get<T>(key: string): Promise<T> {
        this.ensureAlive()
        return await this.config[key] as T
    }

    async remove(key: string) {
        this.ensureAlive()
        delete this.config[key]
        await this.lockStorage.save(this.config)
    }
}