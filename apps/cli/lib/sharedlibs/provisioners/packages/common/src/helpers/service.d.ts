import { Cluster } from '@c6o/kubeclient-contracts';
import { Service } from '@c6o/kubeclient-resources/core/v1';
import { IngressParameters } from '@provisioner/contracts';
import { ServiceHelper as ServiceHelperContract } from '@provisioner/contracts';
export declare class ServiceHelper<T extends Service = Service> extends ServiceHelperContract<T> {
    static from: (namespace?: string, name?: string) => ServiceHelper<Service>;
    awaitAddress(cluster: Cluster, waitingMessage?: string): Promise<IngressParameters>;
}
