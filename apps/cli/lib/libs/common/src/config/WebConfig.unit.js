"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const WebConfig_1 = require("./WebConfig");
jest.mock('inversify');
jest.mock('debug', () => {
    return jest.fn();
});
const debug_1 = tslib_1.__importDefault(require("debug"));
describe('WebConfig ', () => {
    const SOME_KEY = 'key';
    const SOME_VALUE = 'value';
    beforeEach(() => {
        jest.clearAllMocks();
    });
    test('WebConfig constructor...', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const webConfig = new WebConfig_1.WebConfig();
        expect(webConfig).toBeDefined();
    }));
    test('WebConfig envVars(), no c6oEnv', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const webConfig = new WebConfig_1.WebConfig();
        expect(webConfig.envVars).toEqual(undefined);
    }));
    test('WebConfig envVars() with c60Env', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const _global = (window || global);
        const someEnv = { test: 'test' };
        _global['c6oEnv'] = someEnv;
        const webConfig = new WebConfig_1.WebConfig();
        expect(webConfig.envVars).toEqual(someEnv);
    }));
    test.skip('WebConfig envVars(), more than one window', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const _global = (window || global);
        const someEnv = { test: 'test' };
        _global.parent = { 'c6oEnv': someEnv };
        delete _global['c6oEnv'];
        const webConfig = new WebConfig_1.WebConfig();
        expect(webConfig.envVars).toEqual(someEnv);
    }));
    describe('get(key: string): string ', () => {
        expect(debug_1.default).toBeCalledWith('common:config:web');
        test('get(key: string): string no envVars', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            const webConfig = new WebConfig_1.WebConfig();
            expect(webConfig.get(SOME_KEY)).toBeUndefined();
        }));
        test('get(key: string): string normal case', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            const _global = (window || global);
            const webConfig = new WebConfig_1.WebConfig();
            const someEnv = { key: SOME_VALUE };
            _global['c6oEnv'] = someEnv;
            expect(webConfig.get(SOME_KEY)).toBe(SOME_VALUE);
            expect(webConfig.get('SOME_KEY')).toBeUndefined();
        }));
        test('get(key: string): string throws on error', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            const _global = (window || global);
            delete _global['c6oEnv'];
            const webConfig = new WebConfig_1.WebConfig();
            expect(() => webConfig.get(SOME_KEY)).not.toThrow();
        }));
    });
    test('has = (key: string) => ', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const SOME_KEY = 'key';
        const _global = (window || global);
        const webConfig = new WebConfig_1.WebConfig();
        const someEnv = { key: SOME_VALUE };
        _global['c6oEnv'] = someEnv;
        expect(webConfig.has(SOME_KEY)).toBe(true);
        expect(webConfig.has('SOME_KEY')).toBe(false);
    }));
});
//# sourceMappingURL=WebConfig.unit.js.map