import { Resource } from '@c6o/kubeclient-contracts';
import { KubernetesParams } from '../../services';
import { TerminalUI } from '../base';
import { TerminalUIParams } from '../params';
import { Questions } from '../contracts';
import { Namespace } from '@c6o/kubeclient-resources/core/v1';
export declare class KubernetesResourcesUI<P extends TerminalUIParams> extends TerminalUI<P> {
    static toNamespaceName: (ns: string | Namespace) => string;
    static ensureResourceIdPrompts<P extends KubernetesParams, K extends keyof P = keyof P>(helperFrom: (namespace?: any) => Resource, params: P, namespaceOrNamespaceIdProp?: K, resourceIdProp?: K, filter?: (r: Resource) => boolean): Promise<Questions<P>>;
}
