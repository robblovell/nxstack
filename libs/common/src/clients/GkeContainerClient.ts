import { BaseClient } from './BaseClient'

export class GkeContainerClient extends BaseClient {
    token
    tokenPromise

    get apiURL() { return 'https://container.googleapis.com/v1beta1' }

    async init(token?) {
        await super.init(token || process.env.GKE_TOKEN)
    }

    createCluster = async (projectId: string, zoneId: string, spec: any) => {
        const response = await this.post(`projects/${projectId}/locations/${zoneId}/clusters`, spec)
        return response.data
    }

    deleteCluster = async (targetUrl: string) => {
        const response = await this.delete(targetUrl)
        return response
    }

    getClusters = async (projectId: string, zoneId: string) => {
        const response = await this.get(`projects/${projectId}/locations/${zoneId}/clusters`)
        return response.data
    }

    getCluster = async (targetUrl: string) => {
        const response = await this.get(targetUrl)
        return response.data
    }

    waitForCluster = async (targetUrl: string) => {
        function sleep(ms) {
            return new Promise(resolve => setTimeout(resolve, ms))
        }

        let clusterInfo = await this.getCluster(targetUrl)
        while (clusterInfo.status === 'PROVISIONING') {
            await sleep(2000)
            clusterInfo = await this.getCluster(targetUrl)
        }

        return clusterInfo
    }

    getKubeOptions = async (projectId: string, zoneId: string) => {
        const response = await this.get(`projects/${projectId}/zones/${zoneId}/serverconfig`)
        return response.data
    }

    getKubeConfig = async (targetUrl: string) => {
        const cluster = await this.getCluster(targetUrl)
        return this._generateKubecConfig(cluster.masterAuth.clusterCaCertificate, cluster.endpoint)
    }

    getRecommendedZones = async (projectId: string) => {
        const response = await this.get(`projects/${projectId}/locations`)
        return response.data?.locations.filter(item => item.type === 'ZONE' && item.recommended)
    }

    private _generateKubecConfig = (certificate: string, endpoint: string) => ({
        apiVersion: 'v1',
        kind: 'Config',
        clusters: [{
            cluster: {
                'certificate-authority-data': certificate,
                server: `https://${endpoint}`
            },
            name: 'gke-cluster'
        }],
        contexts: [{
            context: {
                cluster: 'gke-cluster',
                user: 'gke-user'
            },
            name: 'gke-context'
        }],
        'current-context': 'gke-context',
        users: [{
            name: 'gke-user',
            user: {
                token: this.token
            }
        }]
    })
}