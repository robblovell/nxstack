import { Cluster } from '@c6o/kubeclient-contracts';
import { AppResource, AppHelper as AppHelperContract } from '@provisioner/contracts';
export declare class AppHelper<T extends AppResource = AppResource> extends AppHelperContract<T> {
    static template: (namespace?: string, name?: string) => AppResource;
    static from: (namespace?: string, name?: string) => AppHelper<AppResource>;
    read(cluster: Cluster, errorMessage?: string): Promise<AppResource>;
    list(cluster: Cluster, errorMessage?: string): Promise<AppResource[]>;
    static byInterface(cluster: Cluster, interfaceName: string, errorMessage?: string): Promise<Array<AppResource>>;
}
