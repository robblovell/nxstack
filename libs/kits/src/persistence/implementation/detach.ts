import { DeploymentHelper, DetachRequest } from '@provisioner/contracts'
import { Deployment } from '@c6o/kubeclient-resources/apps/v1'
import { persistenceBaseMixinType } from '../helper'
import { Resource, Result } from '@c6o/kubeclient-contracts'
import { PersistenceHelperError } from '../errors'

export interface DetachMixin {
    detachSimpleImplementation(request: DetachRequest): Promise<Result>
    detachDestructiveImplementation(request: DetachRequest): Promise<Result>

    removePVCReferenceFromPV(doc: Resource)

    removePVCFromDeployment(doc: Resource, name: string): Promise<Result>
    removeVolumeFromDeployment(doc: Resource, request: DetachRequest): Promise<Result>

    deletePVC(doc: Resource): Promise<Result>

    setVolumeToRetain(doc: Resource)
}

export const detachMixin = (base: persistenceBaseMixinType) => class
    extends base implements DetachMixin {
    constructor() {
        super()
    }

    /* Detach Volume */
    //TODO: for simple implementation, determine if the pvc is unmounted from the pods:
    async detachSimpleImplementation(request: DetachRequest): Promise<Result> {
        // Modify the deployment document, remove the mountPath/name pair within the volumeMounts array and
        // the that volumes entry as well that corresponds to the mount path or name.
        const deployment: DeploymentHelper = await this.getDeployment(request.namespace, request.appName)
        // remove the volumeMount and volume from the deployment.
        await this.removeVolumeFromDeployment(deployment.resource, request)
        return
    }

    async detachDestructiveImplementation(request: DetachRequest): Promise<Result> {
        // get the pvc and then the pv and check the policy and make sure it's retain
        // get the pvc
        let pvc: Resource
        if (request.persistentVolumeClaimName) {
            pvc = await this.getPersistentVolumeClaim(
                request.namespace, request.persistentVolumeClaimName)
        } else {
            pvc = await this.getPersistentVolumeClaimFromMountPath(
                request.namespace, request.appName, request.mountPath)
        }

        // get the pv
        const persistentVolume = await this.getPersistentVolume(pvc.spec?.volumeName)

        // make sure the policy is retain
        await this.setVolumeToRetain(persistentVolume)

        // get the deployment for this app.
        const deployment: DeploymentHelper = await this.getDeployment(request.namespace, request.appName)

        // remove the PVC from the deployment
        await this.removePVCFromDeployment(deployment.resource, request.persistentVolumeClaimName)

        // remove the persistent volume claim from the cluster
        await this.deletePVC(pvc)

        // At this point, the controller takes over. When the pvc is actually terminated, the controller
        // removes the claimRef from the persistent volume.

        return
    }

    async removePVCReferenceFromPV(doc: Resource) {
        const result = await this.cluster.patch(doc, [
            {
                'op': 'remove',
                'path': '/spec/claimRef'
            }])
        if (result.error)
            throw new PersistenceHelperError(result.error)
    }

    async removeVolumeFromDeployment(doc: Resource, request: DetachRequest): Promise<Result> {
        // Remove the PVC from two sections:
        // from spec/template/spec/containers[x]/volumeMounts[name]
        const indexes = []
        const requestReference = request.mountPath ? request.mountPath : request.persistentVolumeClaimName
        let foundVolumeMount
        doc.spec.template?.spec?.containers?.forEach((container, index1) => {
            container.volumeMounts?.forEach((volumeMount, index2) => {
                if (volumeMount.name === request.persistentVolumeClaimName ||
                    volumeMount.mountPath === request.mountPath) {
                    foundVolumeMount = volumeMount
                    indexes.push({ container: index1, volume: index2 })
                }
            })
        })
        if (indexes.length) {
            // make sure we delete the indexes from the last to the first so that the positions don't change.
            indexes.reverse()
            for (const index of indexes) {
                const result = await this.cluster.patch(doc, [
                    {
                        'op': 'remove',
                        'path': `/spec/template/spec/containers/${index.container}/volumeMounts/${index.volume}`
                    },
                    {
                        'op': 'remove',
                        'path': `/spec/template/spec/volumes/${index.volume}`
                    }])
                if (result.error)
                    throw new PersistenceHelperError(result.error)
            }
        }
        if (!foundVolumeMount)
            throw new PersistenceHelperError(`No volume mount found for this request.${requestReference}`)

        if (!indexes.length) { //|| !indexes2.length) {
            throw new Error(`No mounted volume for request: ${requestReference} not found to detach for this application.`)
        }

        return
    }

    async removePVCFromDeployment(doc: Resource, name: string): Promise<Result> {
        // Remove the PVC from two sections:
        // from spec/template/spec/containers[x]/volumeMounts[name]
        // from spec/template/spec/volumes[name]
        const indexes = []
        doc.spec.template?.spec?.containers?.forEach((container, index1) => {
            container.volumeMounts?.forEach((volumeMount, index2) => {
                if (volumeMount.name === name)
                    indexes.push({ container: index1, volume: index2 })
            })
        })
        if (indexes.length) {
            // make sure we delete the indexes from the last to the first so that the positions don't change.
            indexes.reverse()
            for (const index of indexes) {
                const result = await this.cluster.patch(doc, [
                    {
                        'op': 'remove',
                        'path': `/spec/template/spec/containers/${index.container}/volumeMounts/${index.volume}`
                    },
                    {
                        'op': 'remove',
                        'path': `/spec/template/spec/volumes/${index.volume}`
                    }
                ])
                if (result.error)
                    throw new PersistenceHelperError(result.error)
            }
        }

        if (!indexes.length) { //} || !indexes2.length) {
            throw new Error(`No mounted volume ${name} found to detach for this application.`)
        }

        return
    }

    async deletePVC(doc: Resource): Promise<Result> {
        // delete the pvc
        const result = await this.cluster.delete(doc)

        if (result.error)
            throw new PersistenceHelperError(result.error)
        return result
    }

    async setVolumeToRetain(doc: Resource) {
        // make sure the policy is set to retain.
        if (doc.spec?.persistentVolumeReclaimPolicy.toLowerCase() !== 'retain') {
            const result = await this.cluster.patch(doc, [
                { 'op': 'replace', 'path': '/spec/persistentVolumeReclaimPolicy', 'value': 'Retain' }
            ])
            if (result.error)
                throw new PersistenceHelperError(result.error)
        }
    }

}
