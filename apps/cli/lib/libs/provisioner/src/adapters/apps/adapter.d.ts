import { Namespace } from '@c6o/kubeclient-resources/core/v1';
import { Cluster, PatchOp, Status } from '@c6o/kubeclient-contracts';
import { actionType, AppResource, ProvisionerBase, stageType } from '@provisioner/contracts';
import { NamespacedAdapter } from '../contracts';
import { NamespacedAdapterHelper } from '../namespace';
import { Resolver } from './resolver';
export interface AppAdapterOptions {
    cluster: Cluster;
    action?: actionType;
    stage?: stageType;
    status?: Status;
}
export declare class AppAdapter implements NamespacedAdapter<AppResource> {
    protected options: AppAdapterOptions;
    resource?: AppResource;
    get status(): Status;
    get cluster(): Cluster;
    get action(): actionType;
    get stage(): stageType;
    namespace: Namespace;
    namespaceHelper: NamespacedAdapterHelper<AppResource>;
    resolver: Resolver;
    provisioners: Array<ProvisionerBase>;
    constructor(options: AppAdapterOptions, resource?: AppResource);
    ensureAppCRD(): Promise<void>;
    load(): Promise<void>;
    inquire(options: any): Promise<void>;
    validate(): Promise<void>;
    preApply(): Promise<void>;
    preCreateApplyNamespaces(): Promise<void>;
    apply(): Promise<void>;
    toPending(resource: AppResource): Promise<void>;
    toComplete(): Promise<PatchOp>;
    toError(): Promise<Partial<AppResource>>;
    error(): Promise<boolean>;
    addFinalizer(appSpec: AppResource): void;
    removeFinalizer(appSpec: any): Promise<void>;
    addLastAppliedConfig(appSpec: any): void;
    systemPostCreateApp(appSpec: any): Promise<void>;
    systemPostUpdateApp(appSpec: any): Promise<void>;
    systemPostRemoveApp(appSpec: any): Promise<void>;
    doAll(title?: string, ...args: any): Promise<void>;
}
