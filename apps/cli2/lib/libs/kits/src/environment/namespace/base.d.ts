import { Cluster, ResourceHelper, listOptions } from '@c6o/kubeclient-contracts';
import { Namespace, NamespaceList } from '@c6o/kubeclient-resources/core/v1';
export declare type paging = Pick<listOptions, 'limit' | 'continue'>;
export declare abstract class BaseNamespaceHelper extends ResourceHelper<Namespace> {
    abstract get type(): any;
    abstract get typeDisplay(): any;
    isType: (namespace: Namespace) => boolean;
    makeType: (namespace: Namespace) => Namespace;
    template: (name?: string) => {
        apiVersion: string;
        kind: string;
        metadata: {
            labels: {
                'system.codezero.io/type': any;
            };
            name: string;
        };
    };
    get(cluster: Cluster, name: string): Promise<Namespace>;
    list(cluster: Cluster, page?: paging): Promise<Generator<import("@c6o/kubeclient-contracts").Resource, void, unknown>>;
    find(cluster: Cluster, page?: paging): Promise<NamespaceList>;
    upsert(cluster: Cluster, name: string): Promise<Namespace>;
    create(cluster: Cluster, name: string): Promise<Namespace>;
    delete(cluster: Cluster, name: string): Promise<Namespace>;
}
