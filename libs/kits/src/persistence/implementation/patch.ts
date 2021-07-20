import { PatchRequest } from '@provisioner/contracts'
import { persistenceBaseMixinType } from '../helper'
import { Resource, Result } from '@c6o/kubeclient-contracts'
import { Deployment } from '@c6o/kubeclient-resources/apps/v1'

export interface PatchMixin {
    patchImplementation(request: PatchRequest): Promise<Result>
}

export const patchMixin = (base: persistenceBaseMixinType) => class
    extends base implements PatchMixin {
    constructor() {
        super()
    }

    /* Patch Resource */
    async patchImplementation(request: PatchRequest): Promise<Result> {
        // Get the document
        const resource: Resource =
            await this.getResource(request.kind, request.name, request.namespace, request.apiVersion)

        // Execute the patch operation
        const result = await this.cluster.patch(resource, [
            {
                'op': request.op,
                'path': request.path,
                'value': JSON.parse(request.value) }
        ])
        result.throwIfError()
        return
    }

}
