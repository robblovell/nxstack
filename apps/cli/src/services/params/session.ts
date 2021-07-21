import { Cluster } from '@c6o/kubeclient-contracts'
import { ServiceParams } from '../base'

export interface SessionParams extends ServiceParams {
    clean?: boolean
    wait?: boolean
}

export interface ClusterSessionParams extends SessionParams {
    cluster?: Cluster
    namespace: string
}