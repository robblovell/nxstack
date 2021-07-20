import { AttachRequest, DeleteRequest, DetachRequest, PersistenceKit, ExpansionAllowedRequest, ExpandRequest, PatchRequest, SnapshotRequest, DeploymentHelper, AppHelper } from '@provisioner/contracts';
import { Result } from '@c6o/kubeclient-contracts';
import { Cluster } from '@c6o/kubeclient/client';
export declare type persistenceBaseMixinType = new (...a: any[]) => Persistence;
declare const Persistence_base: any;
export declare class Persistence extends Persistence_base implements PersistenceKit {
    cluster: Cluster;
    constructor();
    attach(request: AttachRequest): Promise<Result>;
    detach(request: DetachRequest): Promise<Result>;
    delete(request: DeleteRequest): Promise<Result>;
    list(request: any): Promise<Result>;
    expand(request: ExpandRequest): Promise<Result>;
    expansionAllowed(request: ExpansionAllowedRequest): Promise<boolean>;
    patch(request: PatchRequest): Promise<Result>;
    snapshot(request: SnapshotRequest): Promise<Result>;
    snapshotAllowed(): Promise<boolean>;
    copy(persisentvolumeClaimName: string, namespace: string, appId: string, targetVolumeName: string): Promise<Result>;
    restore(volumeSnapshotName: string, namespace: string, appId: string, persisentvolumeClaimName: string): Promise<Result>;
    runWorker(workerFile: any, options: any): Promise<void>;
    getResource(name: any, kind: any, namespace: any, apiVersion: any): Promise<import("@c6o/kubeclient-contracts").Resource>;
    getDeployment(namespace: any, appName: any): Promise<DeploymentHelper>;
    getPersistentVolume(volumeName: any): Promise<import("@c6o/kubeclient-contracts").Resource>;
    getPersistentVolumeClaim(namespace: any, persistentVolumeClaimName: any): Promise<import("@c6o/kubeclient-contracts").Resource>;
    getPersistentVolumeClaimFromMountPath(namespace: any, appName: any, mountPath: any): Promise<import("@c6o/kubeclient-contracts").Resource>;
    getApplication(namespace: any, appName: any): Promise<AppHelper>;
}
export {};
