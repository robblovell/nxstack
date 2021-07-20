import { AppHelper, AttachRequest, DeploymentHelper } from '@provisioner/contracts'
import { Deployment } from '@c6o/kubeclient-resources/apps/v1'
import { PersistenceHelperError } from '../errors'
import { persistenceBaseMixinType } from '../helper'
import { Resource, Result } from '@c6o/kubeclient-contracts'
import { PersistenceGenerator } from '../generators'
import { generatePersistentVolumeClaim } from '../../templates'

export interface AttachPersistence {
    attachSimpleImplementation(request: AttachRequest): Promise<Result>
    attachDestructiveImplementation(request: AttachRequest): Promise<Result>

    addPVCToDeploymentVolumes(doc: Resource, volumeClaimName: string, mountPoint: string): Promise<Result>

    addPVCToDeploymentVolumeMounts(doc: Resource, volumeClaimName: string, mountPoint: string): Promise<Result>

    getPersistentVolumeClaimAndSetupAttach(request: AttachRequest): Promise<Array<any>>

    getVolumeSnapshotAndSetupAttach(request: AttachRequest): Promise<Array<any>>

    getPersistentVolumeAndSetupAttach(request: AttachRequest): Promise<AttachRequest>

    getAppAndSetupAttach(request: AttachRequest): Promise<Array<any>>

    validatePersistentVolumeClaim(persistentVolumeClaim, deployment)

    addOwnerReferenceToVolumeClaim(persistentVolumeClaim, deployment)

    setupAttach(request: AttachRequest): Promise<Array<any>>

    createPersistentVolumeClaim(request: AttachRequest, owners?: Array<Resource>)
}

export const attachMixin = (base: persistenceBaseMixinType) =>
    class extends base implements AttachPersistence {

        constructor() {
            super()
        }

        /* Attach Volume non-destructive implementation */
        async attachSimpleImplementation(request: AttachRequest): Promise<Result> {
            // Get the application so that we can find the previously detached mount point and pvc name.
            const app: AppHelper = await this.getApplication(request.namespace, request.appName)
            const DeploymentHelper: DeploymentHelper = await this.getDeployment(request.namespace, request.appName)
            const deployment = DeploymentHelper.resource
            let volume
            if (request.mountPoint) {
                volume = app.volumes.find((volume) => volume.mountPath === request.mountPoint)
            } else if (request.volumeClaimName) {
                volume = app.volumes.find((volume) => volume.name === request.volumeClaimName)
            } else {
                throw new PersistenceHelperError('Attach request must provide a mount point or volume claim name.')
            }

            // TODO: Check if the pvc exists and create it if it doesn't is left to a later exercise.

            // add the volume claim to the deployment
            await this.addVolumeToDeployment(deployment, volume.name, volume.mountPath)
            return
        }

        /* Attach Volume destructive implementation */
        async attachDestructiveImplementation(request: AttachRequest): Promise<Result> {
            let persistentVolumeClaim
            [persistentVolumeClaim, request] = await this.setupAttach(request)
            // If an existing resource is given (PV, PVC or Snapshot):
            // have mount point, volume name, volume size without a PVC, or that and a PVC here.
            // Get the deployment for the app and modify it to point to the existing or newly created PVC.
            const deployment: DeploymentHelper = await this.getDeployment(request.namespace, request.appName)

            // if an existing resource is NOT given then create a new PVC.
            if (!persistentVolumeClaim) await this.createPersistentVolumeClaim(request, [deployment.resource])
            // add the owner reference to the pvc if it's not there.
            else await this.validatePersistentVolumeClaim(persistentVolumeClaim, deployment.resource)

            // add the volume claim to the deployment
            // TODO: in the created case, the controller adds the references?
            await this.addPVCToDeploymentVolumes(deployment.resource, request.volumeClaimName, request.mountPoint)
            await this.addPVCToDeploymentVolumeMounts(deployment.resource, request.volumeClaimName, request.mountPoint)
            return
        }
        async addVolumeToDeployment(doc, volumeClaimName: string, mountPoint: string): Promise<Result> {
            const volumeMountEntry = PersistenceGenerator.toVolumeMountEntry(volumeClaimName, mountPoint)
            const volumeEntry = PersistenceGenerator.toVolumeEntry(volumeClaimName)

            for (const [index, container] of doc.spec.template.spec.containers.entries()) {
                if (container.volumeMounts) {
                    const result = await this.cluster.patch(doc, [
                        {
                            'op': 'add',
                            'path': `/spec/template/spec/volumes/-`,
                            'value': volumeEntry,
                        },
                        {
                            'op': 'add',
                            'path': `/spec/template/spec/containers/${index}/volumeMounts/-`,
                            'value': volumeMountEntry,
                        },
                        ])
                    if (result.error) {
                        throw new PersistenceHelperError(result)
                    }
                } else {
                    const result = await this.cluster.patch(doc, [
                        {
                            'op': 'add',
                            'path': `/spec/template/spec/volumes`,
                            'value': [volumeEntry],
                        },
                        {
                            'op': 'add',
                            'path': `/spec/template/spec/containers/${index}/volumeMounts`,
                            'value': [volumeMountEntry],
                        },
                        ])
                    if (result.error) {
                        throw new PersistenceHelperError(result)
                    }
                }
            }

            return
        }

        async addPVCToDeploymentVolumeMounts(doc: Resource, volumeClaimName: string, mountPoint: string): Promise<Result> {
            const volumeMountEntry = PersistenceGenerator.toVolumeMountEntry(volumeClaimName, mountPoint)

            // TODO: make more than one container work properly.
            for (const [index, container] of doc.spec.template.spec.containers.entries()) {
                if (container.volumeMounts) {
                    const result = await this.cluster.patch(doc, [
                        {
                            'op': 'add',
                            'path': `/spec/template/spec/containers/${index}/volumeMounts/-`,
                            'value': volumeMountEntry,
                        }])
                    if (result.error) {
                        throw new PersistenceHelperError(result)
                    }
                } else {
                    const result = await this.cluster.patch(doc, [
                        {
                            'op': 'add',
                            'path': `/spec/template/spec/containers/${index}/volumeMounts`,
                            'value': [volumeMountEntry],
                        }])
                    if (result.error) {
                        throw new PersistenceHelperError(result)
                    }
                }
            }

            return
        }

        async addPVCToDeploymentVolumes(doc: Resource, volumeClaimName: string, mountPoint: string): Promise<Result> {
            const volumeEntry = PersistenceGenerator.toVolumeEntry(volumeClaimName)

            if (doc.spec.template.spec.volumes) {
                const result = await this.cluster.patch(doc, [
                    {
                        'op': 'add',
                        'path': `/spec/template/spec/volumes/-`,
                        'value': volumeEntry,
                    }])
                if (result.error)
                    throw new PersistenceHelperError(result.error)
            } else {
                const result = await this.cluster.patch(doc, [
                    {
                        'op': 'add',
                        'path': `/spec/template/spec/volumes`,
                        'value': [volumeEntry],
                    }])
                if (result.error)
                    throw new PersistenceHelperError(result.error)
            }
            return
        }

        async getPersistentVolumeClaimAndSetupAttach(request: AttachRequest): Promise<Array<any>> {
            if (!request.mountPoint)
                throw new PersistenceHelperError('When attaching to an existing persistent volume claim, a mount point must be given.')
            const persistentVolumeClaim =
                await this.getPersistentVolumeClaim(request.namespace, request.volumeClaimName)
            request.volumeName = (persistentVolumeClaim as Resource).spec?.volumeName
            request.volumeSize = (persistentVolumeClaim as Resource).spec?.resources?.requests?.storage
            return [persistentVolumeClaim, request]
        }

        async getVolumeSnapshotAndSetupAttach(request: AttachRequest): Promise<Array<any>> {
            throw new PersistenceHelperError('Attach to snapshot not implemented.')
        }

        async getPersistentVolumeAndSetupAttach(request: AttachRequest): Promise<AttachRequest> {
            if (!request.mountPoint)
                throw new PersistenceHelperError('When attaching to an existing persistent volume, a mount point must be given.')
            try {
                const persistentVolume = await this.getPersistentVolume(request.volumeName)
                request.volumeName = persistentVolume.metadata?.name
                request.volumeSize = persistentVolume.spec?.capacity?.storage
                request.volumeClaimName = request.appName + '-' + request.mountPoint.substring(1).toLowerCase()
                return request
            }
            catch {
                throw new PersistenceHelperError('No persistent volume was found, did you specify one?')
            }
        }

        async getAppAndSetupAttach(request: AttachRequest): Promise<Array<any>> {
            // Get the app, if there is one volume, use the values.
            const appObject: AppHelper = await this.getApplication(request.namespace, request.appName)
            const app = appObject.resource
            // If there are more than one, a mountPath or the volume claim name must be given, otherwise throw.
            if (app.spec.provisioner.volumes?.length === 0) {
                throw new PersistenceHelperError('If the application has more than one volume, ' +
                    'mount point or a volume claim name must be given when only an app is given.')
            }
            let volumeClaim
            if (app.spec.provisioner.volumes?.length === 1) {
                volumeClaim = app.spec.provisioner.volumes[0]
            } else {
                volumeClaim = app.spec.provisioner.volumes.find((volume) => volume.mountPath == request.mountPoint)
                if (!volumeClaim) {
                    volumeClaim = app.spec.provisioner.volumes.find(
                        (volume) => volume.name == request.volumeClaimName
                    )
                }
            }
            if (!volumeClaim) {
                throw new PersistenceHelperError('If the application has more than one volume, a mount point or ' +
                    'a volume claim name must be given when only an app is given.')
            }
            request.mountPoint = volumeClaim.mountPath
            request.volumeClaimName = volumeClaim.name
            request.volumeSize = volumeClaim.size
            try {
                const persistentVolumeClaim = await this.getPersistentVolumeClaim(request.namespace, request.volumeClaimName)
                return [persistentVolumeClaim, request]
            }
            catch {
                return [undefined, request]
            }
        }

        async validatePersistentVolumeClaim(persistentVolumeClaim, deployment) {
            const deploymentAppOwnerReference = deployment.metadata.ownerReferences.find(item => item.kind === 'App')
            if (!deploymentAppOwnerReference)
                throw new PersistenceHelperError('No deployment found for this application, is it installed properly?')
            // make sure that the PVC isn't owned by an existing deployment, if it is, make sure it's owned by the app's deployment.
            if (deploymentAppOwnerReference && persistentVolumeClaim.metadata.ownerReferences?.some((reference) =>
                (reference.name !== deploymentAppOwnerReference.name || reference.kind !== deploymentAppOwnerReference.kind)
            )) {
                throw new PersistenceHelperError('Existing persistent volume is owned by another deployment.')
            }
            if (!persistentVolumeClaim.metadata.ownerReferences)
                await this.addOwnerReferenceToVolumeClaim(persistentVolumeClaim, deployment)
        }

        async addOwnerReferenceToVolumeClaim(persistentVolumeClaim, deployment) {
            const result = await this.cluster.patch(persistentVolumeClaim, [
                {
                    'op': 'add',
                    'path': `/metadata/ownerReferences`,
                    'value': deployment.metadata.ownerReferences,
                }])
            if (result.error)
                throw new PersistenceHelperError(result.error)
        }

        async setupAttach(request: AttachRequest): Promise<Array<any>> {
            // To build a persistent volume you need -> App, Name, Mount Point, Size.
            // The App has a list of the volumes with Mount, Name and Size.
            // There are four use cases:
            // From PV: Need -> App, name of PV (PV has the name & size, but not the mount point)
            // From PVC: Need -> App, name of PVC (PVC has the name & size, but not the mount point)
            // From Snapshot: Need -> App, Name of Snapshot (Snapshot has the name & size, but not the mount point)
            // From Scratch: Need -> App, Name, Size, Mount Point.

            let persistentVolumeClaim
            if (request.volumeClaimName) { // Persistent Volume Claim (PVC)
                [persistentVolumeClaim, request] = await this.getPersistentVolumeClaimAndSetupAttach(request)
            } else if (request.volumeName) { // Persistent Volume (PV)
                request = await this.getPersistentVolumeAndSetupAttach(request)
            } else if (request.volumeSnapshotName) { // Volume Snapshot
                [persistentVolumeClaim, request] = await this.getVolumeSnapshotAndSetupAttach(request)
            } else if (request.appName) { // Just an App Only
                [persistentVolumeClaim, request] = await this.getAppAndSetupAttach(request)
            } else {
                throw new PersistenceHelperError('An app, persistent volume, volume claim or snapshot name must be given.')
            }
            return [persistentVolumeClaim, request]
        }

        async createPersistentVolumeClaim(request: AttachRequest, owners?: Array<Resource>) {
            const appResult: any = await this.getApplication(request.namespace, request.appName)
            const app: AppHelper = new AppHelper(appResult.document)

            const persistentVolumeClaim: any = generatePersistentVolumeClaim(app, {
                name: request.volumeClaimName,
                size: request.volumeSize,
                mountPath: request.mountPoint,
            }, request.namespace)
            if (persistentVolumeClaim && request.volumeName)
                persistentVolumeClaim.spec.volumeName = request.volumeName

            const result = await this.cluster.create(persistentVolumeClaim, owners)
            if (result.error)
                throw new PersistenceHelperError(result.error)
        }

    }
