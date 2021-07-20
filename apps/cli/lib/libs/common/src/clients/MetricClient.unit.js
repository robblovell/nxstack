"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const MetricClient_1 = require("./MetricClient");
jest.mock('axios', () => {
    return {
        get: jest.fn()
            .mockResolvedValue({ data: [{ type: 'p' }] }),
        post: jest.fn()
            .mockResolvedValue({ data: { 'kubernetes_cluster': 'post' } }),
        patch: jest.fn()
            .mockResolvedValue({ data: { 'kubernetes_cluster': 'patch' } }),
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
const jose = tslib_1.__importStar(require("node-jose"));
describe('MetricClient Class', () => {
    const SOME_ID = 'id', SOME_PARAM = 'param';
    beforeEach(() => {
        jest.clearAllMocks();
    });
    test('get apiURL()', () => {
        const SOME_URL = 'url';
        const instance = new MetricClient_1.MetricClient();
        delete process.env.HUB_SERVER_URL;
        expect(instance.apiURL).toBe("http://localhost:3030/api");
        process.env.HUB_SERVER_URL = SOME_URL;
        expect(instance.apiURL).toBe(SOME_URL + '/api');
    });
    test('async init(token?)', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const SOME_TOKEN = 'token1';
        const CLUSTER_KEY = { key: 'key1' };
        const CLUSTER_ID = 'clusterid1';
        const instance = new MetricClient_1.MetricClient();
        yield instance.init(SOME_TOKEN, CLUSTER_KEY, CLUSTER_ID);
        expect(instance.token).toBe(SOME_TOKEN);
        expect(instance.privateKey).toBe(CLUSTER_KEY);
        expect(instance.jwkId).toBe(CLUSTER_ID);
        instance.token = undefined;
        instance.privateKey = undefined;
        instance.jwkId = undefined;
        const SOME_PRIVATEKEY_STRING = `-----BEGIN OPENSSH PRIVATE KEY-----`;
        const SOME_JWKID = 'jwt';
        instance.init(SOME_TOKEN, SOME_PRIVATEKEY_STRING, SOME_JWKID);
        expect(instance.privateKey).toEqual(SOME_PRIVATEKEY_STRING);
        expect(jose.JWK.asKey).toBeCalledWith('��� ӏԒ�HT�(F>��', 'pem');
    }));
    test('upsertCounter(data)', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const SOME_DATA = { inc: 1 };
        const SOME_RESULT = { inc: 1, type: 'counter' };
        const instance = new MetricClient_1.MetricClient();
        jest.spyOn(instance, 'post');
        const result = yield instance.upsertCounter(SOME_DATA);
        expect(SOME_RESULT).toEqual(SOME_RESULT);
        expect(instance.post).toBeCalledWith('metrics', SOME_RESULT);
        expect(result).toEqual({ 'kubernetes_cluster': 'post' });
    }));
    test('upsertGauge(data)', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const SOME_DATA = { inc: 1 };
        const SOME_RESULT = { inc: 1, type: 'gauge' };
        const instance = new MetricClient_1.MetricClient();
        jest.spyOn(instance, 'post');
        const result = yield instance.upsertGauge(SOME_DATA);
        expect(SOME_RESULT).toEqual(SOME_RESULT);
        expect(instance.post).toBeCalledWith('metrics', SOME_RESULT);
        expect(result).toEqual({ 'kubernetes_cluster': 'post' });
    }));
    test('upsertHistogram(data)', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const SOME_DATA = { inc: 1 };
        const SOME_RESULT = { inc: 1, type: 'histogram' };
        const instance = new MetricClient_1.MetricClient();
        jest.spyOn(instance, 'post');
        const result = yield instance.upsertHistogram(SOME_DATA);
        expect(SOME_RESULT).toEqual(SOME_RESULT);
        expect(instance.post).toBeCalledWith('metrics', SOME_RESULT);
        expect(result).toEqual({ 'kubernetes_cluster': 'post' });
    }));
    test('doUpsert(data)', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const SOME_DATA = { name: 'cluster' };
        const instance = new MetricClient_1.MetricClient();
        jest.spyOn(instance, 'post');
        const result = yield instance.doUpsert(SOME_DATA);
        expect(instance.post).toBeCalledWith('metrics', SOME_DATA);
        expect(result).toEqual({ 'kubernetes_cluster': 'post' });
    }));
});
//# sourceMappingURL=MetricClient.unit.js.map