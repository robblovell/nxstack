import { Cluster } from '@c6o/kubeclient-contracts'
import { ServiceParams } from '../base'

export interface NamespaceParams extends ServiceParams {
    namespace: string
}

export interface KubernetesParams extends ServiceParams {
    kubeconfig?: string
    cluster?: Cluster
}