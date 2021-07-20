import { BaseClient } from './BaseClient'

export class DigitalOceanClient extends BaseClient {
    token
    tokenPromise

    get apiURL() { return 'https://api.digitalocean.com/v2' }

    async init(token?) {
        await super.init(token || process.env.DO_TOKEN)
    }

    createCluster = async (spec) => {
        const response = await this.post('kubernetes/clusters', spec)
        return response.data?.['kubernetes_cluster']
    }

    deleteCluster = async (id) => {
        const response = await this.delete(`kubernetes/clusters/${id}`)
        return response
    }

    getClusters = async () => {
        const response = await this.get('kubernetes/clusters')
        return response.data?.['kubernetes_clusters']
    }

    getCluster = async (clusterId: string) => {
        const response = await this.get(`kubernetes/clusters/${clusterId}`)
        return response.data?.['kubernetes_cluster']
    }

    waitForCluster = async (clusterId) => {
        function sleep(ms) {
            return new Promise(resolve => setTimeout(resolve, ms))
        }

        let clusterInfo = await this.getCluster(clusterId)
        while (clusterInfo.status?.state === 'provisioning') {
            await sleep(2000)
            clusterInfo = await this.getCluster(clusterId)
        }

        return clusterInfo
    }

    getKubeOptions = async () => {
        const response = await this.get('kubernetes/options')
        return response.data
    }

    getKubeConfig = async (clusterId: string) => {
        const response = await this.get(`kubernetes/clusters/${clusterId}/kubeconfig`)
        return response.data
    }

    getAccount = async () => {
        const response = await this.get('account')
        return response.data?.account
    }

    getBalance = async () => {
        const response = await this.get('customers/my/balance')
        return response.data
    }
}