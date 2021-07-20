import { ResourceId } from '@c6o/kubeclient-contracts'
import { KubernetesParams } from '../params/kubernetes'

export interface MonitorParams extends KubernetesParams {
    resourceQuery?: ResourceId
    debounce?: number
}
