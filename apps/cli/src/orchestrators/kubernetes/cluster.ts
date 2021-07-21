import { Cluster } from '@c6o/kubeclient'
import { KubernetesParams } from '../../services'
import { Questions } from '../../ui'

export class Kubernetes {

    /**
     * Ensures that there is a cluster for upstream operations
     * @param params
     * @returns Does not have any prompts so always returns undefined
     */
    static async ensureCluster<P extends KubernetesParams = KubernetesParams, K extends keyof P = keyof P>(
        params: P,
        clusterKey: K = 'cluster' as K)
        : Promise<Questions<P>> {

        if (params[clusterKey]) return
        const { kubeconfig } = params
        const cluster = new Cluster({ kubeconfig })
        cluster.status = params.status
        params[clusterKey] = cluster as unknown as P[K]
    }
}