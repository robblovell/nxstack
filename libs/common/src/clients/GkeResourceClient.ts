import { BaseClient } from './BaseClient'

export class GkeResourceClient extends BaseClient {
    token
    tokenPromise

    get apiURL() { return 'https://cloudresourcemanager.googleapis.com/v1' }

    async init(token?) {
        await super.init(token || process.env.GKE_TOKEN)
    }

    getProjects = async () => {
        const response = await this.get('projects')
        return response.data?.projects
    }

    hasPermissions = async(projectId: string, permissions: string[]): Promise<boolean> => {
        try {
            const result = await this.post(`projects/${projectId}:testIamPermissions`, { permissions } )
            if (result.data?.permissions?.length !== permissions.length) {
                return false
            }
        } catch (ex) {
            return false
        }
        return true
    }
}