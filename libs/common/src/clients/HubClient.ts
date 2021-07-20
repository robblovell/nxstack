import { BaseClient } from './BaseClient'

export type permissionType = 'a' | 'w' | 'r'
export type typeType = 'apps' | 'clusters' | 'account' | 'editions'

export class HubClient extends BaseClient {
    get apiURL()  { return (process.env.HUB_SERVER_URL || 'https://codezero.io') + '/api' }

    async init(token?, privateKey?, jwkId?) {
        await super.init(token || process.env.HUB_TOKEN, privateKey || process.env.CLUSTER_KEY, jwkId || process.env.CLUSTER_ID)
    }

    async getMe() {
        const res = await this.get('accounts')
        return this.toData(res).find((user) => user.type === 'p')
    }

    async getApps() {
        const res = await this.get('apps')
        return this.toData(res)
    }

    async createApp(app) {
        const res = await this.post('apps', app)
        return this.toData(res)
    }

    async getClusters() {
        const res = await this.get('clusters')
        return this.toData(res)
    }

    async getCluster(id, params?) {
        const res = await this.get(`clusters/${id}`, params)
        return this.toData(res)
    }

    async createCluster(data) {
        const res = await this.post('clusters', data)
        return this.toData(res)
    }

    async patchCluster(id, data) {
        const res = await this.patch(`clusters/${id}`, data)
        return this.toData(res)
    }

    async getClusterCredentials(id, createIfNone = false) {
        const params = createIfNone ? { $createIfNone: true } : undefined
        const res = await this.get(`clusters/${id}/cert`, params)
        return this.toFirst(res)
    }

    async getApp(namespace, showPublic = true) {
        const res = await this.get('apps', { namespace, showPublic })
        return this.toFirst(res)
    }

    async getAccounts(filters = null) {
        const res = await this.get('accounts', filters)
        return this.toData(res)
    }

    async getEditions(appId) {
        const res = await this.get('editions', { appId })
        return this.toData(res)
    }

    async getAppManifest(appId, name) {
        const res = await this.get('editions', { appId, name, $manifest: true })
        return this.toData(res)
    }

    async getAppEditionManifest(appNamespace, edition) {
        const res = await this.get(`apps/${appNamespace}/editions/${edition}`)
        return this.toData(res)
    }

    async createEdition(edition) {
        const res = await this.post('editions', edition)
        return this.toData(res)
    }

    async grant(type: typeType, id, perm: permissionType, personId?, orgId?, name?) {
        const res = (personId) ?
            await this.post(`permissions/${type}/${id}`, { perm, personId }) :
            await this.post(`permissions/${type}/${id}`, { perm, teamId: { orgId, name } })
        return this.toData(res)
    }

    async getPermissions(type: typeType, id) {
        const res = await this.get(`permissions/${type}/${id}`, { $perms: true })
        return this.toData(res)
    }

    async transferOwnershipTo(type: typeType, id: string, toAccountId: string) {
        const res = await this.post(`permissions/${type}/${id}`, { toAccountId })
        return this.toData(res)
    }

    async getStatus() {
        const res = await this.get('')
        return this.toData(res)
    }

    async upsertFromManifest(manifest) {
        const res = await this.post('apps', { manifest })
        return this.toData(res)
    }
}