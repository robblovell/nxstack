import { clearDocumentSignal, DOCUMENT_SIGNAL_JSON_PATCH } from '@provisioner/contracts'
import { PatchOps, Resource } from '@c6o/kubeclient-contracts'
import * as assignDeep from 'assign-deep'
import * as jsonpatch from 'fast-json-patch'
import { Adapter } from './adapters'


export class TransactionHelper<R extends Resource = Resource> {

    private preApplyDocument

    constructor(private adapter: Adapter<R>) { }

    /**
     * Try to set document status and return true if it worked
     * This can be used to create a critical section where no other
     * thread modifies the document at the same time
     * https://cs.nyu.edu/~yap/classes/os/resources/origin_of_PV.html
     * @param status status to change to
     */
    async beginTransaction() {
        // Fetch the current document if we aren't
        // working with a cluster document
        const current = await this.adapter.cluster.read(this.adapter.resource)
        // Merge the incoming document with the current document
        if (current.object) {
            this.preApplyDocument = jsonpatch.deepClone(current.object)
            this.adapter.resource = assignDeep(current.object, this.adapter.resource)
        }

        // Transition the status to pending
        await this.adapter.toPending(this.adapter.resource)
        clearDocumentSignal(this.adapter.resource)

        const result = this.adapter.resource.metadata.resourceVersion ?
            await this.adapter.cluster.put(this.adapter.resource, this.adapter.resource) :
            await this.adapter.cluster.create(this.adapter.resource)

        result.throwIfError()
        this.adapter.resource = result.as<R>()
        return true
    }

    /**
     * Closes out the transaction
     */
    async endTransaction() {
        let diffs: PatchOps = []
        if (this.preApplyDocument) {

            this.removeUnset = this.removeUnset(this.adapter.resource.spec)
            diffs = jsonpatch.compare(this.preApplyDocument, this.adapter.resource) as PatchOps

            // Only allow changes to the provisioner, annotations
            //  and labels section of the document
            diffs = diffs.filter(diff => diff.path !== `/metadata/annotations/${DOCUMENT_SIGNAL_JSON_PATCH}` && (
                diff.path.startsWith('/spec/provisioner') ||
                diff.path.startsWith('/metadata/annotations') ||
                diff.path.startsWith('/metadata/labels') ||
                diff.path.startsWith('/metadata/finalizers')))
        }

        const completeOp = await this.adapter.toComplete(this.adapter.resource)
        diffs.push(completeOp)

        const result = await this.adapter.cluster.patch(this.adapter.resource, diffs)
        result.throwIfError()
        this.adapter.resource = result.as<R>()
    }

    // https://stackoverflow.com/questions/23774231/how-do-i-remove-all-null-and-empty-string-values-from-a-json-object
    removeUnset = (obj) => {
        Object.keys(obj).forEach(k =>
            (obj[k] && typeof obj[k] === 'object') && this.removeUnset(obj[k]) ||
            (obj[k] === '$unset') && delete obj[k]
        )
        return obj
    };

    async errorTransaction() {
        const errorPatch = await this.adapter.toError(this.adapter.resource)
        const result = await this.adapter.cluster.patch(this.adapter.resource, errorPatch)
        result.throwIfError()
        this.adapter.resource = result.as<R>()
    }
}