import { BaseClient } from './BaseClient'

export class GkeComputeClient extends BaseClient {
    token
    tokenPromise

    get apiURL() { return 'https://compute.googleapis.com/compute/v1' }

    async init(token?) {
        await super.init(token || process.env.GKE_TOKEN)
    }

    getMachineTypes = async (projectId: string, zoneId: string, vmSeriesPrefix?: string) => {
        const response = await this.get(`projects/${projectId}/zones/${zoneId}/machineTypes`)
        return response.data?.items?.filter(item => !vmSeriesPrefix || item.name?.startsWith(vmSeriesPrefix))
    }
}

