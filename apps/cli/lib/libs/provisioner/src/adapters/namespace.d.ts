import { Namespace } from '@c6o/kubeclient-resources/core/v1';
import { Resource } from '@c6o/kubeclient-contracts';
import { NamespacedAdapter } from './contracts';
export declare class NamespacedAdapterHelper<R extends Resource> {
    private adapter;
    constructor(adapter: NamespacedAdapter<R>);
    newNamespace: string;
    appNamespaceChoices: any;
    appNamespaceWhen: (answers: any) => Promise<boolean>;
    appNamespace: (options?: any) => any;
    inquireAppNamespace(options: any): Promise<void>;
    validateAppNamespace(): void;
    ensureAppNamespace(): Promise<void>;
    ensureNamespace(namespace: string | Namespace): Promise<Namespace>;
}
