import { Cluster, ResourceHelper } from '@c6o/kubeclient-contracts';
import { StorageClass } from '@c6o/kubeclient-resources/storage/v1';
export declare type PartialStorageClass = Omit<StorageClass, 'provisioner'>;
export declare class StorageClassHelper<T extends PartialStorageClass = PartialStorageClass> extends ResourceHelper<T> {
    static template: (name?: string) => PartialStorageClass;
    static from: (name?: string) => StorageClassHelper<PartialStorageClass>;
    static inquire: (cluster: Cluster, options: any) => any;
    static getDefault: (cluster: Cluster) => Promise<string>;
}
