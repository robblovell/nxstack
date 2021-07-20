import { keyValue } from '@c6o/kubeclient-contracts';
import { Secret, SecretList } from '@c6o/kubeclient-resources/core/v1';
import { SecretHelper as SecretHelperContract } from '@provisioner/contracts';
export declare class SecretHelper<T extends Secret = Secret> extends SecretHelperContract<T> {
    resourceList: SecretList;
    static from: (namespace?: string, name?: string) => SecretHelper<Secret>;
    static toKeyValues(secrets: Secret): keyValue;
}
