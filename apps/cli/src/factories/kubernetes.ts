import * as path from 'path'
import { Cluster } from '@c6o/kubeclient'

export const getKubeconfig = (params: any) => {
    return (params.kubestring) ?
        { kubestring: params.kubestring } :
        { kubeconfig: params.kubeconfig ? path.resolve(params.kubeconfig) : process.env.KUBECONFIG }
}

export const getCluster = (params: any) => new Cluster(getKubeconfig(params))
