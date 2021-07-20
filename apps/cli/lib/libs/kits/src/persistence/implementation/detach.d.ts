import { DeploymentHelper, DetachRequest } from '@provisioner/contracts';
import { Deployment } from '@c6o/kubeclient-resources/apps/v1';
import { persistenceBaseMixinType } from '../helper';
import { Resource, Result } from '@c6o/kubeclient-contracts';
export interface DetachMixin {
    detachSimpleImplementation(request: DetachRequest): Promise<Result>;
    detachDestructiveImplementation(request: DetachRequest): Promise<Result>;
    removePVCReferenceFromPV(doc: Resource): any;
    removePVCFromDeployment(doc: Resource, name: string): Promise<Result>;
    removeVolumeFromDeployment(doc: Resource, request: DetachRequest): Promise<Result>;
    deletePVC(doc: Resource): Promise<Result>;
    setVolumeToRetain(doc: Resource): any;
}
export declare const detachMixin: (base: persistenceBaseMixinType) => {
    new (): {
        detachSimpleImplementation(request: DetachRequest): Promise<Result>;
        detachDestructiveImplementation(request: DetachRequest): Promise<Result>;
        removePVCReferenceFromPV(doc: Resource): Promise<void>;
        removeVolumeFromDeployment(doc: Resource, request: DetachRequest): Promise<Result>;
        removePVCFromDeployment(doc: Resource, name: string): Promise<Result>;
        deletePVC(doc: Resource): Promise<Result>;
        setVolumeToRetain(doc: Resource): Promise<void>;
        cluster: import("../../../../../sharedlibs/kubeclient/packages/client/src").Cluster;
        attach(request: import("@provisioner/contracts").AttachRequest): Promise<Result>;
        detach(request: DetachRequest): Promise<Result>;
        delete(request: import("@provisioner/contracts").DeleteRequest): Promise<Result>;
        list(request: any): Promise<Result>;
        expand(request: import("@provisioner/contracts").ExpandRequest): Promise<Result>;
        expansionAllowed(request: import("@provisioner/contracts").ExpansionAllowedRequest): Promise<boolean>;
        patch(request: import("@provisioner/contracts").PatchRequest): Promise<Result>;
        snapshot(request: import("@provisioner/contracts").SnapshotRequest): Promise<Result>;
        snapshotAllowed(): Promise<boolean>;
        copy(persisentvolumeClaimName: string, namespace: string, appId: string, targetVolumeName: string): Promise<Result>;
        restore(volumeSnapshotName: string, namespace: string, appId: string, persisentvolumeClaimName: string): Promise<Result>;
        runWorker(workerFile: any, options: any): Promise<void>;
        getResource(name: any, kind: any, namespace: any, apiVersion: any): Promise<Resource>;
        getDeployment(namespace: any, appName: any): Promise<DeploymentHelper<Deployment>>;
        getPersistentVolume(volumeName: any): Promise<Resource>;
        getPersistentVolumeClaim(namespace: any, persistentVolumeClaimName: any): Promise<Resource>;
        getPersistentVolumeClaimFromMountPath(namespace: any, appName: any, mountPath: any): Promise<Resource>;
        getApplication(namespace: any, appName: any): Promise<import("@provisioner/contracts").AppHelper<import("@provisioner/contracts").AppResource>>;
    };
};
