import { Namespace } from '@c6o/kubeclient-resources/core/v1';
import { Resource, PatchOp, Cluster, Status } from '@c6o/kubeclient-contracts';
export interface Adapter<R extends Resource> {
    cluster: Cluster;
    status?: Status;
    resource?: R;
    toPending(resource: R): Promise<void>;
    toComplete(resource: R): Promise<PatchOp>;
    toError(resource: R): Promise<Partial<R>>;
    load(): Promise<void>;
    inquire(answers?: any): Promise<void>;
    validate(): Promise<void>;
    preApply(): Promise<void>;
    apply(): Promise<void>;
    error(resource: R): Promise<boolean>;
}
export interface NamespacedAdapter<R extends Resource> extends Adapter<R> {
    namespace: Namespace;
}
