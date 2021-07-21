import { ResourceId } from '@c6o/kubeclient-contracts'
import { Service } from '@c6o/kubeclient-resources/core/v1'
import { KubernetesParams, NamespaceParams, ClusterSessionParams } from '../params'

export interface ServiceProxyParams extends KubernetesParams, NamespaceParams, ClusterSessionParams {
    remoteService: string
    remotePort: number
    remoteServiceResourceId?: ResourceId<Service>

    upstreamURL?: string
    allTraffic?: boolean
    header?: string
}