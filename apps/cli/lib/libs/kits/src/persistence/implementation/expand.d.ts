import { persistenceBaseMixinType } from '../helper';
import { ExpandRequest, ExpansionAllowedRequest } from '@provisioner/contracts';
import { PersistentVolumeClaim } from '@c6o/kubeclient-resources/core/v1';
import { Deployment } from '@c6o/kubeclient-resources/apps/v1';
import { Result } from '@c6o/kubeclient-contracts';
export interface ExpandMixin {
    expandImplementation(request: ExpandRequest): Promise<Result>;
    expandObject(doc: PersistentVolumeClaim, newSize: number, capacityUnit: any): Promise<Result>;
    expansionAllowedImplementation(request: ExpansionAllowedRequest): Promise<boolean>;
    validateExpand(doc: PersistentVolumeClaim, newSize: number, capacityUnit: any): any;
}
export declare const expandMixin: (base: persistenceBaseMixinType) => {
    new (): {
        expandImplementation(request: ExpandRequest): Promise<Result>;
        expandObject(doc: PersistentVolumeClaim, newSize: number, capacityUnit?: string): Promise<Result>;
        expansionAllowedImplementation(request: ExpansionAllowedRequest): Promise<boolean>;
        validateExpand(doc: PersistentVolumeClaim, newSize: number, capacityUnit: any): Promise<void>;
        cluster: import("../../../../../sharedlibs/kubeclient/packages/client/src").Cluster;
        attach(request: import("@provisioner/contracts").AttachRequest): Promise<Result>;
        detach(request: import("@provisioner/contracts").DetachRequest): Promise<Result>;
        delete(request: import("@provisioner/contracts").DeleteRequest): Promise<Result>;
        list(request: any): Promise<Result>;
        expand(request: ExpandRequest): Promise<Result>;
        expansionAllowed(request: ExpansionAllowedRequest): Promise<boolean>;
        patch(request: import("@provisioner/contracts").PatchRequest): Promise<Result>;
        snapshot(request: import("@provisioner/contracts").SnapshotRequest): Promise<Result>;
        snapshotAllowed(): Promise<boolean>;
        copy(persisentvolumeClaimName: string, namespace: string, appId: string, targetVolumeName: string): Promise<Result>;
        restore(volumeSnapshotName: string, namespace: string, appId: string, persisentvolumeClaimName: string): Promise<Result>;
        runWorker(workerFile: any, options: any): Promise<void>;
        getResource(name: any, kind: any, namespace: any, apiVersion: any): Promise<import("@c6o/kubeclient-contracts").Resource>;
        getDeployment(namespace: any, appName: any): Promise<import("@provisioner/contracts").DeploymentHelper<Deployment>>;
        getPersistentVolume(volumeName: any): Promise<import("@c6o/kubeclient-contracts").Resource>;
        getPersistentVolumeClaim(namespace: any, persistentVolumeClaimName: any): Promise<import("@c6o/kubeclient-contracts").Resource>;
        getPersistentVolumeClaimFromMountPath(namespace: any, appName: any, mountPath: any): Promise<import("@c6o/kubeclient-contracts").Resource>;
        getApplication(namespace: any, appName: any): Promise<import("@provisioner/contracts").AppHelper<import("@provisioner/contracts").AppResource>>;
    };
};
