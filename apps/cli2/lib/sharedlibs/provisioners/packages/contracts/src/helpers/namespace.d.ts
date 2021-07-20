import { Namespace } from '@c6o/kubeclient-resources/core/v1';
import { ResourceHelper } from '@c6o/kubeclient-contracts';
export declare class NamespaceHelper<R extends Namespace = Namespace> extends ResourceHelper<R> {
    static template: (name?: string) => Namespace;
    static from: (name?: string) => NamespaceHelper<Namespace>;
}
