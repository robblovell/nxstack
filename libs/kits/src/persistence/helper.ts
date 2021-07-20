import { mix } from 'mixwith'
import {
    AttachRequest,
    DeleteRequest,
    DetachRequest,
    PersistenceKit,
    ExpansionAllowedRequest,
    ExpandRequest,
    PatchRequest,
    SnapshotRequest, AppResource, DeploymentHelper, AppHelper
} from '@provisioner/contracts'
import { Result } from '@c6o/kubeclient-contracts'
import { Deployment } from '@c6o/kubeclient-resources/apps/v1'
import { Cluster } from '@c6o/kubeclient/client'
import { PersistenceAddress } from './address'
import { PersistenceHelperError } from './errors'
import { attachMixin } from './implementation/attach'
import { deleteMixin } from './implementation/delete'
import { detachMixin } from './implementation/detach'
import { expandMixin } from './implementation/expand'
import { patchMixin } from './implementation/patch'
import { snapshotMixin } from './implementation/snapshot'
import { Worker } from 'worker_threads'
import path from 'path'
import { createDebug } from '@c6o/logger'

const debug = createDebug()

export type persistenceBaseMixinType = new (...a) => Persistence

export class Persistence
    extends mix(Object).with(attachMixin, deleteMixin, detachMixin, expandMixin,
        patchMixin, snapshotMixin)
    implements PersistenceKit {
    cluster: Cluster

    // TODO: Set new cluster on the outside of the class.
    constructor() {
        super()
        this.cluster = new Cluster()
    }

    async attach(request: AttachRequest): Promise<Result> {
        return await (this as any).attachDestructiveImplementation(request)
    }

    async detach(request: DetachRequest): Promise<Result> {
        return await (this as any).runWorker('./implementation/provisioning/detach.js', request)
    }

    async delete(request: DeleteRequest): Promise<Result> {
        return await (this as any).deleteImplementation(request)
    }

    async list(request: any): Promise<Result> {
        const result = request.metadata.name ?
            await this.cluster.read(request) :
            await this.cluster.list(request)
        result.throwIfError()
        return result
    }

    async expand(request: ExpandRequest): Promise<Result> {
        return await (this as any).expandImplementation(request)
    }

    async expansionAllowed(request: ExpansionAllowedRequest): Promise<boolean> {
        return await (this as any).expansionAllowedImplementation(request)
    }

    async patch(request: PatchRequest): Promise<Result> {
        return await (this as any).patchImplementation(request)
    }

    async snapshot(request: SnapshotRequest): Promise<Result> {
        return await (this as any).snapshotImplementation(request)
    }

    async snapshotAllowed(): Promise<boolean> {
        return await (this as any).snapshotAllowedImplementation()
    }

    /* Copy Volume */

    // TODO: copy
    async copy(persisentvolumeClaimName: string, namespace: string, appId: string, targetVolumeName: string): Promise<Result> {
        throw new PersistenceHelperError('Method not implemented.')
    }

    /* Restore snapshots */

    // TODO: Restore volume from snapshot
    async restore(volumeSnapshotName: string, namespace: string, appId: string, persisentvolumeClaimName: string): Promise<Result> {
        throw new PersistenceHelperError('Method not implemented.')
    }

    /* General Background Worker */

    async runWorker(workerFile, options) {
        debug('Calling: ', workerFile, options)
        const worker = new Worker(path.resolve(__dirname, workerFile), { workerData: options })
        // TODO: refactor to send messages back to the front end and CLI using mechanism below
        worker.on('message', async (message) => {
            debug('worker message', message)
        })
        worker.on('exit', async (code) => {
            debug('worker complete', code)
        })
        worker.on('error', async (...args) => {
            debug('worker error', args)
        })
        return
    }

    // Get Helpers
    async getResource(name, kind, namespace, apiVersion) {
        const address = PersistenceAddress.toAddress(
            name, kind, namespace, apiVersion
        )
        const result = await this.cluster.read(address)
        result.throwIfError()
        return result.object
    }

    async getDeployment(namespace, appName): Promise<DeploymentHelper> {
        const deploymentAddress = PersistenceAddress.toDeploymentAddress(
            namespace,
            appName,
        )
        const deploymentResult = await this.cluster.read(deploymentAddress)
        deploymentResult.throwIfError()
        return new DeploymentHelper(deploymentResult.as<Deployment>())
    }

    async getPersistentVolume(volumeName) {
        const pvAddress = PersistenceAddress.toPersisentVolumeAddress(volumeName)
        const pvResult = await this.cluster.read(pvAddress)
        pvResult.throwIfError()
        return pvResult.object
    }

    async getPersistentVolumeClaim(namespace, persistentVolumeClaimName) {
        const pvcAddress = PersistenceAddress.toPersisentVolumeClaimAddress(namespace, persistentVolumeClaimName)
        const pvcResult = await this.cluster.read(pvcAddress)
        pvcResult.throwIfError()
        return pvcResult.object
    }

    async getPersistentVolumeClaimFromMountPath(namespace, appName, mountPath) {
        const app = await this.getApplication(namespace, appName)
        const volumeMount = app.spec.provisioner.volumes.find(volume => volume.mountPath === mountPath)
        const pvcAddress = PersistenceAddress.toPersisentVolumeClaimAddress(namespace, volumeMount.name)
        const pvcResult = await this.cluster.read(pvcAddress)
        pvcResult.throwIfError()
        return pvcResult.object
    }

    async getApplication(namespace, appName): Promise<AppHelper> {
        const appAddress = PersistenceAddress.toAppAddress(
            namespace,
            appName,
        )
        const appResult = await this.cluster.read(appAddress)
        appResult.throwIfError()
        return new AppHelper(appResult.object as AppResource)
    }

}


