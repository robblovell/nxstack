import { HubClient, permissionType, typeType } from "./HubClient"

jest.mock('axios', () => {
    return {
        get: jest.fn()
            .mockResolvedValue({ data: [{ type: 'p' }] }),
        post: jest.fn()
            .mockResolvedValue({ data: { 'kubernetes_cluster': 'post' } }),
        patch: jest.fn()
            .mockResolvedValue({ data: { 'kubernetes_cluster': 'patch' } }),
        // delete: jest.fn().mockResolvedValue('delete'),
    }
})
jest.mock('inversify')
jest.mock('node-jose', () => {
    return {
        JWS: {
            createSign: jest.fn().mockReturnValue({
                update: jest.fn().mockReturnValue({
                    final: jest.fn().mockReturnValue('final'),
                }),
            }),
        },
        JWK: {
            asKey: jest.fn(),
        }
    }
})
import axios from 'axios'

describe('HubClient Class', () => {

    const SOME_ID = 'id', SOME_PARAM = 'param'
    const API_URL = 'https://codezero.io/api'

    beforeEach(() => {
        jest.clearAllMocks()
    })

    test('get apiURL()', () => {
        const SOME_URL = 'url'
        const instance = new HubClient()
        delete process.env.HUB_SERVER_URL
        expect(instance.apiURL).toBe(API_URL)
        process.env.HUB_SERVER_URL = SOME_URL
        expect(instance.apiURL).toBe(`${SOME_URL}/api`)
    })

    test('async init(token?)', () => {
        const SOME_TOKEN = 'token1'
        const CLUSTER_KEY = 'clusterkey1'
        const instance = new HubClient()

        instance.init(SOME_TOKEN, CLUSTER_KEY)
        expect(instance.token).toBe(SOME_TOKEN)
        expect(instance.privateKey).toBe(CLUSTER_KEY)

        process.env.HUB_TOKEN = 'token2'
        process.env.CLUSTER_KEY = 'clusterkey2'
        instance.token = undefined
        instance.privateKey = undefined

        instance.init()
        expect(instance.token).toBe(process.env.HUB_TOKEN)
        expect(instance.privateKey).toBe(process.env.CLUSTER_KEY)
    })

    test('getMe()', async () => {
        const instance = new HubClient()
        jest.spyOn(instance, 'get')
        const result = await instance.getMe()

        expect(instance.get).toBeCalledWith('accounts')
        expect(result).toEqual({ "type": "p" })
    })

    test('getApps()', async () => {
        const instance = new HubClient()
        jest.spyOn(instance, 'get')
        const result = await instance.getApps()

        expect(instance.get).toBeCalledWith('apps')
        expect(result).toEqual([{ "type": "p" }])
    })

    test('createApp(app)', async () => {
        const SOME_APP = { name: 'app' }
        const instance = new HubClient()
        jest.spyOn(instance, 'post')
        const result = await instance.createApp(SOME_APP)

        expect(instance.post).toBeCalledWith('apps', SOME_APP)
        expect(result).toEqual({ 'kubernetes_cluster': 'post' })
    })

    test('getClusters()', async () => {
        const instance = new HubClient()
        jest.spyOn(instance, 'get')
        const result = await instance.getClusters()

        expect(instance.get).toBeCalledWith('clusters')
        expect(result).toEqual([{ "type": "p" }])
    })

    test('getCluster()', async () => {
        const instance = new HubClient()
        jest.spyOn(instance, 'get')
        const result = await instance.getCluster(SOME_ID, SOME_PARAM)

        expect(instance.get).toBeCalledWith(`clusters/${SOME_ID}`, SOME_PARAM)
        expect(result).toEqual([{ "type": "p" }])
    })

    test('createCluster(data)', async () => {
        const SOME_CLUSTER = { name: 'cluster' }
        const instance = new HubClient()
        jest.spyOn(instance, 'post')
        const result = await instance.createCluster(SOME_CLUSTER)

        expect(instance.post).toBeCalledWith('clusters', SOME_CLUSTER)
        expect(result).toEqual({ 'kubernetes_cluster': 'post' })
    })

    test('patchCluster(data)', async () => {
        const SOME_CLUSTER = { name: 'cluster' }
        const instance = new HubClient()
        jest.spyOn(instance, 'patch')
        const result = await instance.patchCluster(SOME_ID, SOME_CLUSTER)

        expect(instance.patch).toBeCalledWith(`clusters/${SOME_ID}`, SOME_CLUSTER)
        expect(result).toEqual({ 'kubernetes_cluster': 'patch' })
    })

    test('getClusterCredentials()', async () => {
        const instance = new HubClient()
        jest.spyOn(instance, 'get')
        const result1 = await instance.getClusterCredentials(SOME_ID, true)

        expect(instance.get).toBeCalledWith(`clusters/${SOME_ID}/cert`, { $createIfNone: true })
        expect(result1).toEqual({ "type": "p" })

        const result2 = await instance.getClusterCredentials(SOME_ID, false)

        expect(instance.get).toBeCalledWith(`clusters/${SOME_ID}/cert`, undefined)
        expect(result2).toEqual({ "type": "p" })
    })

    test('getApp()', async () => {
        const SOME_NAMESPACE = 'name', SHOW_PUBLIC = true
        const instance = new HubClient()
        jest.spyOn(instance, 'get')
        const result = await instance.getApp(SOME_NAMESPACE, SHOW_PUBLIC)

        expect(instance.get).toBeCalledWith('apps', { namespace: SOME_NAMESPACE, showPublic: SHOW_PUBLIC })
        expect(result).toEqual({ "type": "p" })
    })

    test('getAccounts()', async () => {
        const SOME_FILTER = 'filter'
        const instance = new HubClient()
        jest.spyOn(instance, 'get')
        const result = await instance.getAccounts(SOME_FILTER)

        expect(instance.get).toBeCalledWith('accounts', SOME_FILTER)
        expect(result).toEqual([{ "type": "p" }])
    })

    test('getEditions()', async () => {
        const SOME_ID = 'filter'
        const instance = new HubClient()
        jest.spyOn(instance, 'get')
        const result = await instance.getEditions(SOME_ID)

        expect(instance.get).toBeCalledWith('editions', { appId: SOME_ID })
        expect(result).toEqual([{ "type": "p" }])
    })

    test('getAppManifest()', async () => {
        const SOME_ID = 'id'
        const SOME_NAME = 'name'
        const instance = new HubClient()
        jest.spyOn(instance, 'get')
        const result = await instance.getAppManifest(SOME_ID, SOME_NAME)

        expect(instance.get).toBeCalledWith('editions', { appId: SOME_ID, name: SOME_NAME, $manifest: true })
        expect(result).toEqual([{ "type": "p" }])
    })

    test('getAppEditionManifest()', async () => {
        const SOME_NAMESPACE = 'id'
        const SOME_EDITION = 'name'
        const instance = new HubClient()
        jest.spyOn(instance, 'get')
        const result = await instance.getAppEditionManifest(SOME_NAMESPACE, SOME_EDITION)

        expect(instance.get).toBeCalledWith(`apps/${SOME_NAMESPACE}/editions/${SOME_EDITION}`)
        expect(result).toEqual([{ "type": "p" }])
    })

    test('getAppEditionManifest()', async () => {
        const SOME_NAMESPACE = 'id'
        const SOME_EDITION = 'name'
        const instance = new HubClient()
        jest.spyOn(instance, 'get')
        const result = await instance.getAppEditionManifest(SOME_NAMESPACE, SOME_EDITION)

        expect(instance.get).toBeCalledWith(`apps/${SOME_NAMESPACE}/editions/${SOME_EDITION}`)
        expect(result).toEqual([{ "type": "p" }])
    })

    test('createEdition(data)', async () => {
        const SOME_EDITION = { name: 'edition' }
        const instance = new HubClient()
        jest.spyOn(instance, 'post')
        const result = await instance.createEdition(SOME_EDITION)

        expect(instance.post).toBeCalledWith('editions', SOME_EDITION)
        expect(result).toEqual({ 'kubernetes_cluster': 'post' })
    })

    test('getPermissions()', async () => {
        const SOME_ID = 'id'
        const SOME_TYPE: typeType = 'apps'
        const instance = new HubClient()
        jest.spyOn(instance, 'get')
        const result = await instance.getPermissions(SOME_TYPE, SOME_ID)

        expect(instance.get).toBeCalledWith(`permissions/${SOME_TYPE}/${SOME_ID}`, { $perms: true })
        expect(result).toEqual([{ "type": "p" }])
    })

    test('grant(type: typeType, id, perm: permissionType, personId?, orgId?, name?)', async () => {
        const SOME_ID = 'id'
        const SOME_TYPE: typeType = 'apps'
        const SOME_PERM: permissionType = 'a'
        const SOME_PERSON_ID  = 'apps'
        const SOME_ORG_ID = 'apps'
        const NAME = 'apps'
        const instance = new HubClient()
        jest.spyOn(instance, 'post')
        const result1 = await instance.grant(SOME_TYPE, SOME_ID, SOME_PERM, SOME_PERSON_ID)

        expect(instance.post).toHaveBeenNthCalledWith(
            1,
            `permissions/${SOME_TYPE}/${SOME_ID}`, { perm: SOME_PERM, personId: SOME_PERSON_ID })
        expect(result1).toEqual({ 'kubernetes_cluster': 'post' })

        const result2 = await instance.grant(SOME_TYPE, SOME_ID, SOME_PERM, null, SOME_ORG_ID, NAME)

        expect(instance.post).toHaveBeenNthCalledWith(
            2,
            `permissions/${SOME_TYPE}/${SOME_ID}`, { perm: SOME_PERM, teamId: { orgId: SOME_ORG_ID, name: NAME } })
        expect(result2).toEqual({ 'kubernetes_cluster': 'post' })
    })

    test('transferOwnershipTo(type: typeType, id: string, toAccountId: string)', async () => {
        const SOME_ID = 'id'
        const SOME_TYPE: typeType = 'apps'
        const SOME_ACCOUNT_ID: typeType = 'apps'
        const instance = new HubClient()
        jest.spyOn(instance, 'post')
        const result = await instance.transferOwnershipTo(SOME_TYPE, SOME_ID, SOME_ACCOUNT_ID)

        expect(instance.post).toBeCalledWith(`permissions/${SOME_TYPE}/${SOME_ID}`, { toAccountId: SOME_ACCOUNT_ID })
        expect(result).toEqual({ 'kubernetes_cluster': 'post' })
    })

    test('getStatus()', async () => {
        const instance = new HubClient()
        jest.spyOn(instance, 'get')
        const result = await instance.getStatus()

        expect(instance.get).toBeCalledWith('')
        expect(result).toEqual([{ "type": "p" }])
    })

    test('upsertFromManifest(manifest)', async () => {
        const SOME_MANIFEST = { name: 'edition' }
        const instance = new HubClient()
        jest.spyOn(instance, 'post')
        const result = await instance.upsertFromManifest(SOME_MANIFEST)

        expect(instance.post).toBeCalledWith('apps', { manifest: SOME_MANIFEST })
        expect(result).toEqual({ 'kubernetes_cluster': 'post' })
    })
})