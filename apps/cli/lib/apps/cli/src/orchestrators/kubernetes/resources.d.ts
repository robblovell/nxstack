import { Resource } from '@c6o/kubeclient-contracts';
import { KubernetesParams } from '../../services';
import { Questions } from '../../ui';
export declare class KubernetesResources {
    static ensureResourceId<P extends KubernetesParams, K extends keyof P = keyof P>(params: P, helperFrom: (namespace?: any, name?: any) => Resource, nameProp: K, resourceIdProp?: K, namespaceOrNamespaceIdProp?: K, filter?: (r: Resource) => boolean): Promise<Questions<P>>;
}
