import { ClusterSessionOptions, LockingSessionStorage } from './contracts'
import { createDebug } from '@c6o/logger'
import { SessionHelper, SessionResource } from './helper'
import { EnvironmentNamespaceHelper } from '@c6o/kits'
import { Namespace } from '@c6o/kubeclient-resources/lib/core/v1'
import { Cluster, PatchOps } from '@c6o/kubeclient-contracts'

const debug = createDebug()

const ClusterSessionDefaultNamespace = 'default'
export class ClusterSessionStorage implements LockingSessionStorage {

    private _disposed = false
    private cluster: Cluster
    private namespace: string

    // The CRD of the resource where the session information is stored.
    static get locksLocation() { return 'sessions.system.codezero.io' }

    private sessionHelper(): SessionHelper {
        return SessionHelper.from(this.namespace, this.keySignature)
    }

    constructor(private keySignature, options: ClusterSessionOptions) {
        this.namespace = options.namespace || ClusterSessionDefaultNamespace
        this.cluster = options.cluster
    }

    disposed(): boolean {
        return this._disposed
    }

    private async ensureContainer(): Promise<Namespace> {
        const helper = new EnvironmentNamespaceHelper()
        try {
            return await helper.get(this.cluster, this.namespace)
        }
        catch {
            return await helper.create(this.cluster, this.namespace)
        }
    }

    async save(data: string): Promise<void> {
        debug(`Save: ${data}`)
        const sessionHelper = this.sessionHelper()
        const patch: PatchOps =
            [{
                op: 'replace',
                path: '/spec',
                value: data
            }]
        const result = await this.cluster.patch(sessionHelper.resource, patch)
        result.throwIfError()
    }

    async create(data: string): Promise<void> {
        const sessionHelper = this.sessionHelper()
        sessionHelper.resource.spec = data
        const result = await this.cluster.create(sessionHelper.resource)
        result.throwIfError()
    }

    async load(): Promise<any> {
        const sessionHelper = this.sessionHelper()
        const result = await this.cluster.read(sessionHelper.resource)
        result.throwIfError()
        const session = result.as<SessionResource>()
        return session.spec || {}
    }

    static async list(options: ClusterSessionOptions): Promise<SessionResource[]> {
        await SessionHelper.ensureCRD(options.cluster)
        const resource = await SessionHelper.from(options.namespace).resource
        const result = await options.cluster.list(resource)
        result.throwIfError()
        return Array.from(result.each('Session'))
    }

    static async subSessionList(options: ClusterSessionOptions): Promise<string[]> {
        await SessionHelper.ensureCRD(options.cluster)
        const sessions = await ClusterSessionStorage.list(options)
        return sessions.map(session => session.metadata.name)
    }

    static async purge(options: ClusterSessionOptions): Promise<void> {
        await SessionHelper.ensureCRD(options.cluster)
        const result = await options.cluster.delete(SessionHelper.from(options.namespace).resource)
        result.throwIfError()
    }

    // todo: need a proper name here.
    async ensure(data: string): Promise<boolean> {
        debug('locks resource %s', ClusterSessionStorage.locksLocation)
        // ensure a namespace exists:
        await SessionHelper.ensureCRD(this.cluster)
        const sessionHelper = this.sessionHelper()
        if (!await sessionHelper.exists(this.cluster)) {
            // ensure a namespace exists:
            await this.ensureContainer()
            // TODO:: await ensureOwner(FileSessionStorage.locksLocation)
            await this.create(data)
            return true
        }
        return false
    }

    async lock(): Promise<void> {
        if (this._disposed)
            throw new Error('Attempt a remote lock when no lock exists')
        try {
            const sessionHelper = this.sessionHelper()
            debug('Locking the remote resource: %o', sessionHelper.resource)
            await sessionHelper.beginTransaction(this.cluster)
        }
        catch (error) {
            throw new Error('Attempt to use a locked resource.')
        }
    }

    async release() {
        try {
            // Safe to call release after dispose
            if (this._disposed) return
            const sessionHelper = this.sessionHelper()
            debug('freeing the remote lock: %o', sessionHelper.resource)
            await sessionHelper.endTransaction(this.cluster)
        } catch (error) {
            debug('release error: ', error)
            throw error
        }
    }

    async dispose() {
        try {
            await this.release()
            const sessionHelper = this.sessionHelper()
            debug('calling delete on: %o', sessionHelper.resource)
            await this.cluster.delete(sessionHelper.resource)
            this._disposed = true
        } catch (error) {
            debug('dispose error: %o', error)
            throw error
        }
    }
}
