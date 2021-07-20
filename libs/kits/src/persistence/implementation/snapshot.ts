
import {persistenceBaseMixinType} from '../helper'
import {SnapshotRequest} from '@provisioner/contracts'
import {Result} from '@c6o/kubeclient-contracts'
import {PersistenceHelperError} from '../errors'
import {PersistenceGenerator} from '../generators'
import { Deployment } from '@c6o/kubeclient-resources/apps/v1'

export const snapshotMixin = (base: persistenceBaseMixinType) => class extends base {

    constructor() {
        super()
    }

    /* Snapshot Volume */
    async snapshotImplementation(request: SnapshotRequest): Promise<Result> {
        const snapshot = PersistenceGenerator.createSnapshotTemplate(request.namespace, request.persistentVolumeClaimName, request.volumeSnapshotClassName, request.volumeSnapshotName)
        const result = await this.cluster.create(snapshot)
        result.throwIfError()
        return result
    }

    async snapshotAllowedImplementation(): Promise<boolean> {
        throw new PersistenceHelperError('Method not implemented.')
    }

}
