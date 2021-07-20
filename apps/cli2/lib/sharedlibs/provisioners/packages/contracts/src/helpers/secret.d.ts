import { keyValue, ResourceHelper } from '@c6o/kubeclient-contracts';
import { Secret } from '@c6o/kubeclient-resources/core/v1';
export declare class SecretHelper<T extends Secret = Secret> extends ResourceHelper<T> {
    static from: (namespace?: string, name?: string) => SecretHelper<Secret>;
    static template: (namespace?: string, name?: string, data?: keyValue) => Secret;
}
