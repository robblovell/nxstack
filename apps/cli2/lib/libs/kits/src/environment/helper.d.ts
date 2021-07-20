import { Cluster, ResourceHelper, listOptions } from '@c6o/kubeclient-contracts';
import { Namespace } from '@c6o/kubeclient-resources/core/v1';
export declare type paging = Pick<listOptions, 'limit' | 'continue'>;
export declare class EnvironmentHelper extends ResourceHelper<Namespace> {
    template: (name?: string) => {
        apiVersion: string;
        kind: string;
        metadata: {
            labels: {
                'system.codezero.io/type': string;
            };
            name: string;
        };
    };
    create(cluster: Cluster, name: string): Promise<Namespace>;
    delete(cluster: Cluster, name: string): Promise<Namespace>;
    list(cluster: Cluster, page?: paging): Promise<Generator<import("@c6o/kubeclient-contracts").Resource, void, unknown>>;
}
