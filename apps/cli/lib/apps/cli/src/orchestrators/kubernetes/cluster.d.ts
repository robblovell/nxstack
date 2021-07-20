import { KubernetesParams } from '../../services';
import { Questions } from '../../ui';
export declare class Kubernetes {
    static ensureCluster<P extends KubernetesParams = KubernetesParams, K extends keyof P = keyof P>(params: P, clusterKey?: K): Promise<Questions<P>>;
}
