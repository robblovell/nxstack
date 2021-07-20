import { DeleteRequest } from '@provisioner/contracts'
import { persistenceBaseMixinType } from '../helper'
import { Resource, Result } from '@c6o/kubeclient-contracts'
import { Deployment } from '@c6o/kubeclient-resources/apps/v1'

export interface DeleteMixin {
    deleteImplementation(request: DeleteRequest): Promise<Result>

    setRetainPolicyToDelete(doc: Resource)
}

export const deleteMixin = (base: persistenceBaseMixinType) => class
    extends base implements DeleteMixin {
    constructor() {
        super()
    }

    /* Detach Volume */
    async deleteImplementation(request: DeleteRequest): Promise<Result> {
        // get the pvc and then the pv and check the policy and make sure it's retain
        let persistentVolume
        // if (request.persistentVolumeClaimName) {
        //     // get the pvc
        //     pvc = await this.getPersistentVolumeClaim(request.namespace, request.persistentVolumeClaimName)
        //     // get the pv
        //     persistentVolume = await this.getPersistentVolume(pvc.spec.volumeName)
        // }
        // else if (request.persistentVolumeName) {
            persistentVolume = await this.getPersistentVolume(request.persistentVolumeName)
            // if (request.namespace && request.appName) {
            //     // TODO: find a persistent volume claim that references this volume so that it can be deleted.
            //     pvc = await this.getPersistentVolumeClaimFromVolume(request.namespace, request.appName, persistentVolume)
            // }
        // }
        // make sure the policy is delete
        await this.setRetainPolicyToDelete(persistentVolume)

        // get the deployment for this app.
        // const deployment = await this.getDeployment(request.namespace, request.appName)

        // if (request.persistentVolumeClaimName) {
        // //TODO: The following methods are added by the DetachMixin class, see commented out methods and TODO below.
        //     // remove the PVC from the deployment
        //     await (this as any).removePVCFromDeployment(deployment, request.persistentVolumeClaimName)
        //
        //     // remove the persistent volume claim from the cluster
        //     await (this as any).deletePVC(pvc)
        //
        //     // remove references ot the PVC from the PV
        //     await (this as any).removePVCReferenceFromPV(persistentVolume)
        // //TODO: End todo.
        // }

        return
    }

    async setRetainPolicyToDelete(doc: Resource) {
        // set the policy to Delete.
        const result: Result = await this.cluster.patch(doc, [
            {
                'op': 'replace',
                'path': '/spec/persistentVolumeReclaimPolicy',
                'value': 'Delete' }
        ])
        result.throwIfError()
    }

    async getPersistentVolumeClaimFromVolume(namespace, appName, doc: Resource) {
        throw new Error("deleteMixin::Not implemented: getPersistentVolumeClaimFromVolume")
    }

    // TODO: move these helpers to a common class for delete and detach
    // async removePVCReferenceFromPV(doc: Resource) {
    //     const result = await this.cluster.patch(doc, [
    //         {
    //             'op': 'remove',
    //             'path': `/spec/claimRef`
    //         }])
    //     if (result.error)
    //         throw new PersistenceHelperError(result.error)
    // }
    //
    // async removePVCFromDeployment(doc: Resource, name: string): Promise<Result> {
    //     // Remove the PVC from two sections:
    //     // from spec/template/spec/containers[x]/volumeMounts[name]
    //     const indexes = []
    //     doc.spec.template.spec.containers.forEach((container, index1) => {
    //         container.volumeMounts.forEach((volumeMount, index2) => {
    //             if (volumeMount.name === name)
    //                 indexes.push({container: index1, volume: index2})
    //         })
    //     })
    //     if (indexes.length) {
    //         // make sure we delete the indexes from the last to the first so that the positions don't change.
    //         indexes.reverse()
    //         for (const index of indexes) {
    //             const result = await this.cluster.patch(doc, [
    //                 {
    //                     'op': 'remove',
    //                     'path': `/spec/template/spec/containers/${index.container}/volumeMounts/${index.volume}`
    //                 }])
    //             if (result.error)
    //                 throw new PersistenceHelperError(result.error)
    //         }
    //     }
    //
    //     // from spec/template/spec/volumes[name]
    //     const indexes2 = []
    //     doc.spec.template.spec.volumes.forEach((volume, index) => {
    //         if (volume.name === name)
    //             indexes2.push(index)
    //     })
    //     if (indexes2.length) {
    //         // make sure we delete the indexes2 from the last to the first so that the positions don't change.
    //         indexes2.reverse()
    //         for (const index of indexes2) {
    //             const result = await this.cluster.patch(doc, [
    //                 {
    //                     'op': 'remove',
    //                     'path': `/spec/template/spec/volumes/${index}`
    //                 }])
    //             if (result.error)
    //                 throw new PersistenceHelperError(result.error)
    //         }
    //     }
    //     if (!indexes.length || !indexes2.length) {
    //         throw new Error(`No mounted volume ${name} found to detach for this application.`)
    //     }
    //
    //     return
    // }
    //
    // async deletePVC(doc: Resource): Promise<Result> {
    //     // delete the pvc
    //     const deletePVCResult = await this.cluster.delete(doc)
    //     if (deletePVCResult.error)
    //         throw new PersistenceHelperError(deletePVCResult.error)
    //     return deletePVCResult
    // }

}
