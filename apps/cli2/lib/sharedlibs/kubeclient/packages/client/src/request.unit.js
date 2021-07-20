"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
jest.mock('@kubernetes/client-node', () => {
    return {};
});
jest.mock('request-promise-native', () => {
    return {
        get: jest.fn(),
        post: jest.fn(),
        put: jest.fn(),
        patch: jest.fn(),
        delete: jest.fn(),
    };
});
jest.mock('request', () => {
    const requestForStreamMock = {
        pipe: jest.fn(),
    };
    return jest.fn().mockReturnValue(requestForStreamMock);
});
jest.mock('byline', () => {
    const onMock = jest.fn();
    return {
        createStream: jest.fn().mockReturnValue({
            on: onMock,
        }),
    };
});
const request_1 = require("./request");
describe('Request', () => {
    test('watch', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const SOME_PATH = '/';
        const SOME_OPTIONS = {};
        const KUBECONFIG = {};
        const request = new request_1.Request(KUBECONFIG, false);
        request['getRequestOptions'] = jest.fn().mockResolvedValue({
            headers: {},
        });
        const callbackMock = jest.fn();
        const doneMock = jest.fn();
        const result = yield request.watch(SOME_PATH, SOME_OPTIONS, callbackMock, doneMock);
        expect(result).toEqual(expect.any(Object));
        expect(result.pipe).toBeCalled();
    }));
});
//# sourceMappingURL=request.unit.js.map