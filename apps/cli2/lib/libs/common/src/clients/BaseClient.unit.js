"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const BaseClient_1 = require("./BaseClient");
jest.mock('axios', () => {
    return {
        get: jest.fn().mockReturnValue('get'),
        post: jest.fn().mockReturnValue('post'),
        patch: jest.fn().mockReturnValue('patch'),
        delete: jest.fn().mockReturnValue('delete'),
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
const axios_1 = tslib_1.__importDefault(require("axios"));
class BaseClientFakeClient extends BaseClient_1.BaseClient {
    get apiURL() {
        return 'https://api.com/api';
    }
}
describe('BaseClient Class', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    test('private parseURL(service: string)', () => {
        const instance = new BaseClientFakeClient();
        const THE_API = 'https://api.com/api';
        const SOME_API = 'http://thing.com/api';
        const PATH_API = 'thing.com/api';
        const ONE_SLASH_API_START = '/thing.com/api';
        const ONE_SLASH_API_END = 'thing.com/api/';
        const case1 = instance['parseURL'](THE_API);
        expect(case1).toEqual(THE_API);
        const case2 = instance['parseURL'](SOME_API);
        expect(case2).toEqual(SOME_API);
        const case3 = instance['parseURL'](PATH_API);
        expect(case3).toEqual('https://api.com/api/thing.com/api');
        const case4 = instance['parseURL'](ONE_SLASH_API_START);
        expect(case4).toEqual('https://api.com/api/thing.com/api');
        const case5 = instance['parseURL'](ONE_SLASH_API_END);
        expect(case5).toEqual('https://api.com/api/thing.com/api/');
        class BaseClientFakeClient2 extends BaseClient_1.BaseClient {
            get apiURL() {
                return 'https://api.com/api/';
            }
        }
        const instance2 = new BaseClientFakeClient2();
        const SLASH_PATH_API1 = '/thing.com/api/';
        const case6 = instance2['parseURL'](SLASH_PATH_API1);
        expect(case6).toEqual('https://api.com/api/thing.com/api/');
        const SLASH_PATH_API2 = '/thing.com/api';
        const case7 = instance2['parseURL'](SLASH_PATH_API2);
        expect(case7).toEqual('https://api.com/api/thing.com/api');
    });
    test('async init(token?, privateKey?, jwkId?)', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const instance = new BaseClientFakeClient();
        const SOME_TOKEN = 'thing';
        const SOME_PRIVATEKEY = { key: 'key' };
        const SOME_JWKID = 'jwt';
        instance.init(SOME_TOKEN, SOME_PRIVATEKEY, SOME_JWKID);
        expect(instance.token).toEqual(SOME_TOKEN);
        expect(instance.privateKey).toEqual(SOME_PRIVATEKEY);
        expect(instance.jwkId).toEqual(SOME_JWKID);
        const SOME_PRIVATEKEY_STRING = `-----BEGIN OPENSSH PRIVATE KEY-----`;
        instance.privateKey = undefined;
        instance.init(SOME_TOKEN, SOME_PRIVATEKEY_STRING, SOME_JWKID);
        expect(instance.privateKey).toEqual(SOME_PRIVATEKEY_STRING);
        expect(jose.JWK.asKey).toBeCalledWith('��� ӏԒ�HT�(F>��', 'pem');
    }));
    test('isPEM = () ', () => {
        const instance = new BaseClientFakeClient();
        instance.privateKey = '-----BEGIN RSA PRIVATE KEY-----';
        expect(instance.isPEM()).toBe(true);
        instance.privateKey = 'key';
        expect(instance.isPEM()).toBe(false);
    });
    test('async headers(service, data?, headers?)', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const instance = new BaseClientFakeClient();
        const SOME_SERVICE = 'service';
        const SOME_DATA = 'data';
        const SOME_HEADERS = { header: 'header' };
        const OTHER_HEADERS = { key: 'key' };
        const SOME_TOKEN = 'token';
        const SOME_ID = 'id';
        instance.privateKey = 'key';
        instance.jwkId = SOME_ID;
        const EXPECTED_RESULT = {
            'header': 'header',
            'jwkId': 'id',
            'jws': 'final'
        };
        const case1 = yield instance.headers(SOME_SERVICE, SOME_DATA, SOME_HEADERS);
        expect(case1).toEqual(EXPECTED_RESULT);
        const case3 = yield instance.headers(SOME_SERVICE, SOME_DATA, SOME_HEADERS);
        expect(case3).toEqual(EXPECTED_RESULT);
        instance.token = SOME_TOKEN;
        const case4 = yield instance.headers(SOME_SERVICE, SOME_DATA, SOME_HEADERS);
        expect(case4).toEqual(Object.assign({ 'Authorization': `Bearer ${SOME_TOKEN}` }, SOME_HEADERS));
    }));
    test('data = (data?) => this.privateKey ? undefined : data', () => {
        const instance = new BaseClientFakeClient();
        const SOME_DATA = 'data';
        instance.privateKey = 'key';
        expect(instance.data()).toBeUndefined();
        expect(instance.data(SOME_DATA)).toBeUndefined();
        instance.privateKey = undefined;
        expect(instance.data()).toBeUndefined();
        expect(instance.data(SOME_DATA)).toEqual(SOME_DATA);
    });
    describe('async get(service, params?) ', () => {
        test('async get(service, params?) happy path', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            const instance = new BaseClientFakeClient();
            instance.init = jest.fn();
            const SOME_API = 'http://';
            const SOME_HEADERS = { header: 'header' };
            const parseMock = jest.fn().mockReturnValue(SOME_API);
            const headersMock = jest.fn().mockResolvedValue(SOME_HEADERS);
            instance['parseURL'] = parseMock;
            instance['headers'] = headersMock;
            const SOME_SERVICE = 'http://thing.com';
            const SOME_PARAMS = { param1: 'param1' };
            const result = yield instance.get(SOME_SERVICE, SOME_PARAMS);
            expect(result).toEqual('get');
            expect(parseMock).toBeCalledWith(SOME_SERVICE);
            expect(headersMock).toBeCalledWith(SOME_SERVICE);
            expect(axios_1.default.get).toBeCalledWith(SOME_API, { params: SOME_PARAMS, headers: SOME_HEADERS });
        }));
        test('async get(service, params?) throws', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            const instance = new BaseClientFakeClient();
            instance.init = jest.fn().mockImplementation(() => {
                throw new Error('error');
            });
            const SOME_SERVICE = 'http://thing.com';
            yield expect(() => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                yield instance.get(SOME_SERVICE);
            })).rejects.toThrow('error');
        }));
    });
    describe('async post(service, data?) ', () => {
        test('async post(service, params?) happy path', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            const instance = new BaseClientFakeClient();
            instance.init = jest.fn();
            const SOME_API = 'http://';
            const SOME_HEADERS = { header: 'header' };
            const parseMock = jest.fn().mockReturnValue(SOME_API);
            const headersMock = jest.fn().mockResolvedValue(SOME_HEADERS);
            instance['parseURL'] = parseMock;
            instance['headers'] = headersMock;
            const SOME_SERVICE = 'http://thing.com';
            const SOME_DATA = { data: 'data' };
            const result = yield instance.post(SOME_SERVICE, SOME_DATA);
            expect(result).toEqual('post');
            expect(parseMock).toBeCalledWith(SOME_SERVICE);
            expect(headersMock).toBeCalledWith(SOME_SERVICE, SOME_DATA);
            expect(axios_1.default.post).toBeCalledWith(SOME_API, SOME_DATA, { headers: SOME_HEADERS });
        }));
        test('async post(service, params?) throws', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            const instance = new BaseClientFakeClient();
            instance.init = jest.fn().mockImplementation(() => {
                throw new Error('error');
            });
            const SOME_SERVICE = 'http://thing.com';
            yield expect(() => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                yield instance.post(SOME_SERVICE);
            })).rejects.toThrow('error');
        }));
    });
    describe('async patch(service, data?) ', () => {
        test('async patch(service, params?) happy path', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            const instance = new BaseClientFakeClient();
            instance.init = jest.fn();
            const SOME_API = 'http://';
            const SOME_HEADERS = { header: 'header' };
            const parseMock = jest.fn().mockReturnValue(SOME_API);
            const headersMock = jest.fn().mockResolvedValue(SOME_HEADERS);
            instance['parseURL'] = parseMock;
            instance['headers'] = headersMock;
            const SOME_SERVICE = 'http://thing.com';
            const SOME_DATA = { data: 'data' };
            const result = yield instance.patch(SOME_SERVICE, SOME_DATA);
            expect(result).toEqual('patch');
            expect(parseMock).toBeCalledWith(SOME_SERVICE);
            expect(headersMock).toBeCalledWith(SOME_SERVICE, SOME_DATA);
            expect(axios_1.default.patch).toBeCalledWith(SOME_API, SOME_DATA, { headers: SOME_HEADERS });
        }));
        test('async patch(service, params?) throws', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            const instance = new BaseClientFakeClient();
            instance.init = jest.fn().mockImplementation(() => {
                throw new Error('error');
            });
            const SOME_SERVICE = 'http://thing.com';
            yield expect(() => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                yield instance.patch(SOME_SERVICE);
            })).rejects.toThrow('error');
        }));
    });
    describe('async delete(service)', () => {
        test('async delete (service) happy path', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            const instance = new BaseClientFakeClient();
            const SOME_API = 'http://';
            const SOME_HEADERS = { header: 'header' };
            const parseMock = jest.fn().mockReturnValue(SOME_API);
            const headersMock = jest.fn().mockReturnValue(SOME_HEADERS);
            instance['parseURL'] = parseMock;
            instance['headers'] = headersMock;
            const SOME_SERVICE = 'http://thing.com';
            const result = yield instance.delete(SOME_SERVICE);
            expect(result).toEqual('delete');
            expect(parseMock).toBeCalledWith(SOME_SERVICE);
            expect(axios_1.default.delete).toBeCalledWith(SOME_API, { headers: SOME_HEADERS });
        }));
    });
    test('toData = (res) => res.data?.data || res.data', () => {
        const instance = new BaseClientFakeClient();
        const data = 'data';
        const SOME_RES = { data };
        expect(instance.toData(SOME_RES)).toEqual(data);
        const SOME_OTHER_RES = { data: { data } };
        expect(instance.toData(SOME_OTHER_RES)).toEqual(data);
    });
    test('toFirst = (res) => ', () => {
        const instance = new BaseClientFakeClient();
        const THE_DATA = 'data';
        const SOME_DATA = [THE_DATA, 'data2'];
        const SOME_RES = { data: SOME_DATA };
        expect(instance.toFirst(SOME_RES)).toEqual(THE_DATA);
        const SOME_OTHER_RES = { data: { data: SOME_DATA } };
        expect(instance.toFirst(SOME_OTHER_RES)).toEqual(THE_DATA);
    });
});
//# sourceMappingURL=BaseClient.unit.js.map