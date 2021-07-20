import { DigitalOceanClient } from './DigitalOceanClient';

jest.mock('axios', () => {
    return {
        get: jest.fn()
            .mockResolvedValueOnce({ data: { 'kubernetes_clusters': 'get' } })
            .mockResolvedValueOnce({ data: { 'kubernetes_cluster': 'get' } })
            .mockResolvedValue({ data: { account: 'get' } }),
        post: jest.fn().mockResolvedValue({ data: { 'kubernetes_cluster': 'post' } }),
        patch: jest.fn().mockResolvedValue('patch'),
        delete: jest.fn().mockResolvedValue('delete'),
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

describe('DigitalOceanClient Class', () => {

    beforeEach(() => {
        jest.clearAllMocks()
    })

    test('get apiURL()', () => {
        const instance = new DigitalOceanClient()
        expect(instance.apiURL).toBe('https://api.digitalocean.com/v2')
    })

    test('async init(token?)', () => {
        const SOME_TOKEN = 'token1'
        const instance = new DigitalOceanClient()
        instance.init(SOME_TOKEN)
        expect(instance.token).toBe(SOME_TOKEN)
        process.env.DO_TOKEN = 'token2'
        instance.token = undefined
        instance.privateKey = undefined
        instance.init()
        expect(instance.token).toBe(process.env.DO_TOKEN)
    })

    test('createCluster = async (spec)', async () => {
        const SOME_SPEC = { spec: 'spec' }
        const instance = new DigitalOceanClient()
        jest.spyOn(instance, 'post')
        const result = await instance.createCluster(SOME_SPEC)

        expect(instance.post).toBeCalledWith('kubernetes/clusters', SOME_SPEC)
        expect(result).toEqual('post')
    })

    test('deleteCluster = async (id)', async () => {
        const SOME_ID = 'id'
        const instance = new DigitalOceanClient()
        jest.spyOn(instance, 'delete')
        const result = await instance.deleteCluster(SOME_ID)

        expect(instance.delete).toBeCalledWith(`kubernetes/clusters/${SOME_ID}`)
        expect(result).toEqual('delete')
    })

    test('getClusters = async ()', async () => {
        const instance = new DigitalOceanClient()
        jest.spyOn(instance, 'get')
        const result = await instance.getClusters()

        expect(instance.get).toBeCalledWith(`kubernetes/clusters`)
        expect(result).toEqual('get')
    })

    test('getCluster = async (clusterId: string)', async () => {
        const SOME_CLUSTER_ID = 'id'
        const instance = new DigitalOceanClient()
        jest.spyOn(instance, 'get')
        const result = await instance.getCluster(SOME_CLUSTER_ID)

        expect(instance.get).toBeCalledWith(`kubernetes/clusters/${SOME_CLUSTER_ID}`)
        expect(result).toEqual('get')
    })

    test.todo('waitForCluster = async (clusterId)')

    test('getKubeOptions = async ()', async () => {
        const instance = new DigitalOceanClient()
        jest.spyOn(instance, 'get')
        const result = await instance.getKubeOptions()
        expect(instance.get).toBeCalledWith('kubernetes/options')
        expect(result).toEqual({ account: 'get' })
    })

    test('getKubeConfig = async (clusterId: string)', async () => {
        const SOME_CLUSTER_ID = 'id'
        const instance = new DigitalOceanClient()
        jest.spyOn(instance, 'get')
        const result = await instance.getKubeConfig(SOME_CLUSTER_ID)

        expect(instance.get).toBeCalledWith(`kubernetes/clusters/${SOME_CLUSTER_ID}/kubeconfig`)
        expect(result).toEqual({ account: 'get' })
    })

    test('getAccount = async ()', async () => {
        const instance = new DigitalOceanClient()
        jest.spyOn(instance, 'get')
        const result = await instance.getAccount()
        expect(instance.get).toBeCalledWith('account')
        expect(result).toEqual('get')
    })

    test('getBalance = async ()', async () => {
        const instance = new DigitalOceanClient()
        jest.spyOn(instance, 'get')
        const result = await instance.getBalance()
        expect(instance.get).toBeCalledWith('customers/my/balance')
        expect(result).toEqual({ account: 'get' })
    })
})
