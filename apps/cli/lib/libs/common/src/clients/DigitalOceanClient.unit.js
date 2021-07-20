"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const DigitalOceanClient_1 = require("./DigitalOceanClient");
jest.mock('axios', () => {
    return {
        get: jest.fn()
            .mockResolvedValueOnce({ data: { 'kubernetes_clusters': 'get' } })
            .mockResolvedValueOnce({ data: { 'kubernetes_cluster': 'get' } })
            .mockResolvedValue({ data: { account: 'get' } }),
        post: jest.fn().mockResolvedValue({ data: { 'kubernetes_cluster': 'post' } }),
        patch: jest.fn().mockResolvedValue('patch'),
        delete: jest.fn().mockResolvedValue('delete'),
    };
});
jest.mock('inversify');
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
    };
});
describe('DigitalOceanClient Class', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    test('get apiURL()', () => {
        const instance = new DigitalOceanClient_1.DigitalOceanClient();
        expect(instance.apiURL).toBe('https://api.digitalocean.com/v2');
    });
    test('async init(token?)', () => {
        const SOME_TOKEN = 'token1';
        const instance = new DigitalOceanClient_1.DigitalOceanClient();
        instance.init(SOME_TOKEN);
        expect(instance.token).toBe(SOME_TOKEN);
        process.env.DO_TOKEN = 'token2';
        instance.token = undefined;
        instance.privateKey = undefined;
        instance.init();
        expect(instance.token).toBe(process.env.DO_TOKEN);
    });
    test('createCluster = async (spec)', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const SOME_SPEC = { spec: 'spec' };
        const instance = new DigitalOceanClient_1.DigitalOceanClient();
        jest.spyOn(instance, 'post');
        const result = yield instance.createCluster(SOME_SPEC);
        expect(instance.post).toBeCalledWith('kubernetes/clusters', SOME_SPEC);
        expect(result).toEqual('post');
    }));
    test('deleteCluster = async (id)', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const SOME_ID = 'id';
        const instance = new DigitalOceanClient_1.DigitalOceanClient();
        jest.spyOn(instance, 'delete');
        const result = yield instance.deleteCluster(SOME_ID);
        expect(instance.delete).toBeCalledWith(`kubernetes/clusters/${SOME_ID}`);
        expect(result).toEqual('delete');
    }));
    test('getClusters = async ()', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const instance = new DigitalOceanClient_1.DigitalOceanClient();
        jest.spyOn(instance, 'get');
        const result = yield instance.getClusters();
        expect(instance.get).toBeCalledWith(`kubernetes/clusters`);
        expect(result).toEqual('get');
    }));
    test('getCluster = async (clusterId: string)', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const SOME_CLUSTER_ID = 'id';
        const instance = new DigitalOceanClient_1.DigitalOceanClient();
        jest.spyOn(instance, 'get');
        const result = yield instance.getCluster(SOME_CLUSTER_ID);
        expect(instance.get).toBeCalledWith(`kubernetes/clusters/${SOME_CLUSTER_ID}`);
        expect(result).toEqual('get');
    }));
    test.todo('waitForCluster = async (clusterId)');
    test('getKubeOptions = async ()', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const instance = new DigitalOceanClient_1.DigitalOceanClient();
        jest.spyOn(instance, 'get');
        const result = yield instance.getKubeOptions();
        expect(instance.get).toBeCalledWith('kubernetes/options');
        expect(result).toEqual({ account: 'get' });
    }));
    test('getKubeConfig = async (clusterId: string)', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const SOME_CLUSTER_ID = 'id';
        const instance = new DigitalOceanClient_1.DigitalOceanClient();
        jest.spyOn(instance, 'get');
        const result = yield instance.getKubeConfig(SOME_CLUSTER_ID);
        expect(instance.get).toBeCalledWith(`kubernetes/clusters/${SOME_CLUSTER_ID}/kubeconfig`);
        expect(result).toEqual({ account: 'get' });
    }));
    test('getAccount = async ()', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const instance = new DigitalOceanClient_1.DigitalOceanClient();
        jest.spyOn(instance, 'get');
        const result = yield instance.getAccount();
        expect(instance.get).toBeCalledWith('account');
        expect(result).toEqual('get');
    }));
    test('getBalance = async ()', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const instance = new DigitalOceanClient_1.DigitalOceanClient();
        jest.spyOn(instance, 'get');
        const result = yield instance.getBalance();
        expect(instance.get).toBeCalledWith('customers/my/balance');
        expect(result).toEqual({ account: 'get' });
    }));
});
//# sourceMappingURL=DigitalOceanClient.unit.js.map