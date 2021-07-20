import { Cluster, PatchOp, PatchOps, Resource } from '@c6o/kubeclient-contracts'
import {
    clearDocumentSignal,
    CodeZeroHelper,
    CodeZeroLabels,
} from '@provisioner/contracts'
import * as jsonpatch from 'fast-json-patch'
import assign from 'assign-deep'
import { projectBaseDir } from '../../base'
import path from 'path'

export interface SessionDocumentLabels extends CodeZeroLabels {
    'system.codezero.io/session': string
    'system.codezero.io/id': string
}

export type SessionStatus = 'Locked' | 'Active' | 'Error'

export interface SessionResource extends Resource {
    apiVersion: 'system.codezero.io/v1',
    kind: 'Session',
    labels?: SessionDocumentLabels
    status?: SessionStatus
    spec?: any
}

export const SessionStatuses = {
    lock: {
        Pending: 'Locked' as SessionStatus,
        Completed: 'Active' as SessionStatus,
        Error: 'Error' as SessionStatus
    }
}

export class SessionHelper<T extends SessionResource = SessionResource> extends CodeZeroHelper<T> {
    private preApplyDocument
    _sessions

    get sessions() {
        if (this._sessions)
            return this._sessions

        return this._sessions = this.resource.spec.sessions || []
    }

    /** This can be used to fetch the resource from system server */
    get instanceId() {
        return `${this.namespace}-${this.name}`
    }

    get spec() {
        return this.resource.spec
    }

    set spec(spec: any) {
        this.resource.spec = spec
    }

    get isNew() {
        return !!this.resource.metadata.uid
    }

    get sessionNames() {
        return this.sessions.map(sessionObject => this.getSessionName(sessionObject))
    }

    get componentLabels(): SessionDocumentLabels {
        return {
            ...super.componentLabels,
            'system.codezero.io/session': this.name,
            'system.codezero.io/id': this.instanceId,
        }
    }

    static template = (namespace?: string, name?: string, spec?: any): SessionResource => ({
        apiVersion: 'system.codezero.io/v1',
        kind: 'Session',
        metadata: {
            ...(name ? { name } : undefined),
            ...(namespace ? { namespace } : undefined)
        },
        spec
    })

    static from = (namespace?: string, name?: string, spec?: any) => {
        const template = SessionHelper.template(namespace, name, spec)
        return new SessionHelper(template)
    }

    async exists(cluster: Cluster, errorMessage?: string): Promise<boolean> {
        try {
            const result = await cluster.read(this.resource)
            result.throwIfError(errorMessage)
            return !!result.as<SessionResource>()
        } catch (error) {
            return false
        }
    }

    static async ensureCRD(cluster: Cluster): Promise<void> {
        await cluster.begin()
            .upsertFile(path.resolve(projectBaseDir, 'k8s/session.v1.yaml'))
            .end()
    }

    async toPending(resource: SessionResource, action: string): Promise<void> {
        const pendingStatus = SessionStatuses[action].Pending
        // Only allow changes to the status
        if (resource.status === pendingStatus)
            throw new Error(`Cannot modify ${resource.kind} status to ${pendingStatus} because it is currently ${pendingStatus}`)
        resource.status = pendingStatus
    }

    async toComplete(resource: SessionResource, action: string): Promise<PatchOp> {
        // We don't care what the current status is in this case
        const completeStatus = SessionStatuses[action].Completed
        return { op: 'replace', path: '/status', value: completeStatus }
    }

    removeUnset = (obj) => {
        Object.keys(obj).forEach(k =>
            (obj[k] && typeof obj[k] === 'object') && this.removeUnset(obj[k]) ||
            (obj[k] === '$unset') && delete obj[k]
        )
        return obj
    }


    async beginTransaction(cluster: Cluster) {
        // Fetch the current document if we aren't
        // working with a cluster document
        const current = await cluster.read(this.resource)
        // Merge the incoming document with the current document
        if (current.object) {
            this.preApplyDocument = jsonpatch.deepClone(current.object)
            this.resource = assign(this.resource, current.object)
        }

        // Transition the status to pending
        await this.toPending(this.resource, 'lock')
        clearDocumentSignal(this.resource)

        const result = this.resource.metadata.resourceVersion ?
            await cluster.put(this.resource, this.resource) :
            await cluster.create(this.resource)

        result.throwIfError()
        this.resource = result.as<T>()
        return true
    }

    async endTransaction(cluster: Cluster) {
        let diffs: PatchOps = []
        if (this.preApplyDocument) {

            this.removeUnset = this.removeUnset(this.resource.spec)
            diffs = jsonpatch.compare(this.preApplyDocument, this.resource) as PatchOps

            //TODO: what diffs to allow?
            // Only allow changes to the provisioner, annotations
            //  and labels section of the document
            // diffs = diffs.filter(diff => diff.path !== `/metadata/annotations/${DOCUMENT_SIGNAL_JSON_PATCH}` && (
            //     diff.path.startsWith('/spec/provisioner') ||
            //     diff.path.startsWith('/metadata/annotations') ||
            //     diff.path.startsWith('/metadata/labels') ||
            //     diff.path.startsWith('/metadata/finalizers')))
        }

        const completeOp = await this.toComplete(this.resource, 'lock')
        diffs.push(completeOp)

        const result = await cluster.patch(this.resource, diffs)
        result.throwIfError()
        this.resource = result.as<T>()
    }

    // spec is the contents of the session object
    getSessionSpec(sessionName: string) {
        return this.getSessionObject(sessionName)[sessionName]
    }

    // object is the object including the session name tag used by CLI to skip, etc.
    getSessionObject(sessionName: string) {
        return this.sessions.find(sessionObject => this.getSessionName(sessionObject) === sessionName) || {}
    }

    getSessionName = (sessionObject) => Object.keys(sessionObject)[0]

}
