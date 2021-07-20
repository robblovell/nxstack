import { keyValue } from '@c6o/kubeclient-contracts';
import { ConfigMap } from '@c6o/kubeclient-resources/core/v1';
import { ConfigMapHelper as ConfigMapHelperContract } from '@provisioner/contracts';
export declare class ConfigMapHelper<T extends ConfigMap = ConfigMap> extends ConfigMapHelperContract<T> {
    static from: (namespace?: string, name?: string) => ConfigMapHelper<ConfigMap>;
    static toKeyValues(configMap: ConfigMap): keyValue;
}
