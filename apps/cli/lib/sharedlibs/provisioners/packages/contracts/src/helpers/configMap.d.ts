import { keyValue, ResourceHelper } from '@c6o/kubeclient-contracts';
import { ConfigMap } from '@c6o/kubeclient-resources/core/v1';
export declare class ConfigMapHelper<T extends ConfigMap = ConfigMap> extends ResourceHelper<T> {
    static from: (namespace?: string, name?: string) => ConfigMapHelper<ConfigMap>;
    static template: (namespace?: string, name?: string, data?: keyValue) => ConfigMap;
}
