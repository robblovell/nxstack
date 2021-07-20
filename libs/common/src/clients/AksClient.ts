import { BaseClient } from './BaseClient'

export class AksClient extends BaseClient {
    token
    tokenPromise
    isReady = false

    get apiURL() { return 'https://management.azure.com' }
    get resourceApiVersion() { return '2021-01-01' }
    get clusterApiVersion() { return '2021-02-01' }

    async init(token?) {
        await super.init(token || process.env.AKS_TOKEN)
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms))
    }

    waitForReady = async() => {
        while (!this.isReady) {
            await this.sleep(250)
        }
    }

    refreshToken = async(refresh, clientId, clientSecret) => {
        const params = new URLSearchParams()
        params.append('refresh_token', refresh)
        params.append('grant_type', 'refresh_token')
        params.append('client_id', clientId)
        params.append('scope', 'https://management.azure.com/user_impersonation')
        params.append('client_secret', clientSecret)
        const response = await this.post('https://login.microsoftonline.com/organizations/oauth2/v2.0/token', params, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } })
        this.token = response.data?.access_token
        this.isReady = true
    }

    getSubscriptions = async() => {
        await this.waitForReady()
        const response = await this.get(`/subscriptions/?api-version=${this.resourceApiVersion}`)
        return response.data.value
    }

    getResourceGroups = async(subscriptionId: string) => {
        const response = await this.get(`/subscriptions/${subscriptionId}/resourceGroups/?api-version=${this.resourceApiVersion}`)
        return response.data.value
    }

    getLocations = async(subscriptionId: string) => {
        const response = await this.get(`/subscriptions/${subscriptionId}/locations/?api-version=${this.resourceApiVersion}`)
        return response.data?.value.filter(item => item.metadata?.regionCategory === 'Recommended')
    }

    getMachineTypes = async(subscriptionId: string, locationCode: string, vmSeriesPrefix?: string) => {
        const response = await this.get(`/subscriptions/${subscriptionId}/providers/Microsoft.Compute/skus/?api-version=${this.resourceApiVersion}&$filter=location eq '${locationCode}'`)
        return response.data?.value.filter(item => item.resourceType === 'virtualMachines' && item.tier === 'Standard' && (!vmSeriesPrefix || item.size?.startsWith(vmSeriesPrefix)))
    }

    createCluster = async (subscriptionId: string, resourceGroupId: string, name: string, spec: any) => {
        const response = await this.put(`${resourceGroupId}/providers/Microsoft.ContainerService/managedClusters/${name}?api-version=${this.clusterApiVersion}`, spec)
        return response.data
    }

    deleteCluster = async (targetUrl: string) => {
        const response = await this.delete(`${targetUrl}/?api-version=${this.clusterApiVersion}`)
        return response
    }

    getClusters = async (subscriptionId: string, resourceGroupId: string) => {
        const response = await this.get(`/subscriptions/${subscriptionId}/resourceGroups/${resourceGroupId}/providers/Microsoft.ContainerService/managedClusters/?api-version=${this.clusterApiVersion}`)
        return response.data
    }

    getCluster = async (targetUrl: string) => {
        const response = await this.get(`${targetUrl}/?api-version=${this.clusterApiVersion}`)
        return response.data
    }

    waitForCluster = async (targetUrl: string) => {
        function sleep(ms) {
            return new Promise(resolve => setTimeout(resolve, ms))
        }

        let clusterInfo = await this.getCluster(targetUrl)
        while (clusterInfo.properties.provisioningState === 'Creating') {
            await sleep(2000)
            clusterInfo = await this.getCluster(targetUrl)
        }

        return clusterInfo
    }

    getKubeConfig = async (targetUrl: string) => {
        const cluster = await this.post(`${targetUrl}/listClusterUserCredential/?api-version=${this.clusterApiVersion}`)
        const kubeConfig = cluster.data.kubeconfigs?.[0]?.value
        return Buffer.from(kubeConfig, 'base64').toString()
    }
}