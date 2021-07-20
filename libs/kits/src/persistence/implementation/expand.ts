import {persistenceBaseMixinType} from '../helper'
import {ExpandRequest, ExpansionAllowedRequest} from '@provisioner/contracts'
import {PersistentVolumeClaim} from '@c6o/kubeclient-resources/core/v1'
import { Deployment } from '@c6o/kubeclient-resources/apps/v1'
import {Result} from '@c6o/kubeclient-contracts'
import {PersistenceAddress} from '../address'
import {PersistenceHelperError} from '../errors'
import {PersistenceGenerator} from '../generators'

export interface ExpandMixin {
    expandImplementation(request: ExpandRequest): Promise<Result>
    expandObject(doc: PersistentVolumeClaim, newSize: number, capacityUnit): Promise<Result>
    expansionAllowedImplementation(request: ExpansionAllowedRequest): Promise<boolean>
    validateExpand(doc: PersistentVolumeClaim, newSize: number, capacityUnit)
}

export const expandMixin = (base: persistenceBaseMixinType) => class
    extends base implements ExpandMixin
{
    constructor() {
        super()
    }

    /* Expand Volume */
    // Used in the context where the persistent volume document has not been obtained and only a app name and
    // namespace are available, as when used from the cli.
    async expandImplementation(request: ExpandRequest): Promise<Result> {
        let targetDoc = request.targetDoc
        if (!targetDoc) {
            const pvcAddress = PersistenceAddress.toPersisentVolumeClaimAddress(request.namespace, request.persistentVolumeClaimName)
            const result = await this.cluster.read(pvcAddress)
            result.throwIfError()

            targetDoc = result.as<PersistentVolumeClaim>()
        }

        return await this.expandObject(targetDoc, request.newSize, request.capacityUnit)
    }

    // Used in the context of an already obtained persistent volume object, as in the context of the front end ux.
    async expandObject(doc: PersistentVolumeClaim, newSize: number, capacityUnit = 'Gi'): Promise<Result> {
        await this.validateExpand(doc, newSize, capacityUnit)
        const patchDoc = PersistenceGenerator.toExpandEntry(newSize, capacityUnit)
        return await this.cluster.patch(doc, patchDoc)
    }

    async expansionAllowedImplementation(request: ExpansionAllowedRequest): Promise<boolean> {
        if (!request.storageClassName)
            return false
        const scAddress = PersistenceAddress.toStorageClassAddress(request.storageClassName)
        const sc = await this.cluster.read(scAddress)
        return !sc.object?.spec?.allowVolumeExpansion
    }

    async validateExpand(doc: PersistentVolumeClaim, newSize: number, capacityUnit) {
        if (capacityUnit != 'Gi')
            throw new PersistenceHelperError('Currently, the only supported capacity unit is "Gi"')
        if (newSize <= 1 || !Number.isInteger(newSize))
            throw new PersistenceHelperError('The new capacity size must be given as an integer greater than 1')
        if (!doc.spec?.resources?.requests?.storage)
            throw new PersistenceHelperError('Volume created without a capacity.')
        if (newSize <= parseInt(doc.status.capacity.storage))
            throw new PersistenceHelperError('Capacity must be an integer greater than its current size')
        if (!await this.expansionAllowed(doc.spec))
            throw new PersistenceHelperError('This volume cannot be expanded as the storage class provider does not support it')
        if (doc.status?.conditions)
            throw new PersistenceHelperError(`This volume cannot be expanded at the moment because there are pending operations: ${doc.status.conditions.map(({type}) => type).join(', ')}`)
    }

}
