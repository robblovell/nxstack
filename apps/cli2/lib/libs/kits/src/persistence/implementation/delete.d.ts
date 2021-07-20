import { DeleteRequest } from '@provisioner/contracts';
import { persistenceBaseMixinType } from '../helper';
import { Resource, Result } from '@c6o/kubeclient-contracts';
import { Deployment } from '@c6o/kubeclient-resources/apps/v1';
export interface DeleteMixin {
    deleteImplementation(request: DeleteRequest): Promise<Result>;
    setRetainPolicyToDelete(doc: Resource): any;
}
export declare const deleteMixin: (base: persistenceBaseMixinType) => {
    new (): {
        deleteImplementation(request: DeleteRequest): Promise<Result>;
        setRetainPolicyToDelete(doc: Resource): Promise<void>;
        getPersistentVolumeClaimFromVolume(namespace: any, appName: any, doc: Resource): Promise<void>;
        cluster: import("../../../../../sharedlibs/kubeclient/packages/client/src").Cluster;
        attach(request: import("@provisioner/contracts").AttachRequest): Promise<Result>;
        detach(request: import("@provisioner/contracts").DetachRequest): Promise<Result>;
        delete(request: DeleteRequest): Promise<Result>;
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
        getDeployment(namespace: any, appName: any): Promise<import("@provisioner/contracts").DeploymentHelper<Deployment>>;
        getPersistentVolume(volumeName: any): Promise<Resource>;
        getPersistentVolumeClaim(namespace: any, persistentVolumeClaimName: any): Promise<Resource>;
        getPersistentVolumeClaimFromMountPath(namespace: any, appName: any, mountPath: any): Promise<Resource>;
        getApplication(namespace: any, appName: any): Promise<import("@provisioner/contracts").AppHelper<import("@provisioner/contracts").AppResource>>;
    };
};
