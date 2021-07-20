"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
jest.mock('@c6o/kubeclient-contracts', () => {
    return {
        Result: function (params) {
            return params;
        }
    };
});
jest.mock('../request', () => {
    const ABORT_MOCK = jest.fn();
    const REQUEST_MOCK = {
        abort: ABORT_MOCK,
    };
    return {
        Request: function () {
            return {
                watch: jest.fn().mockReturnValue(REQUEST_MOCK),
                requestMock: REQUEST_MOCK,
                abortMock: ABORT_MOCK,
            };
        }
    };
});
const _1 = require("./");
const request_1 = require("../request");
describe('Cluster Watch', () => {
    test('watch', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const SOME_DOCUMENT = {
            metadata: {
                labels: {}
            }
        };
        const AN_ADDRESS = {
            url: 'http://something'
        };
        const KUBECONFIG = {};
        const callbackMock = jest.fn();
        const doneMock = jest.fn();
        const watcher = new _1.Cluster();
        watcher['toAddress'] = jest.fn().mockReturnValue(AN_ADDRESS);
        watcher['status'] = {
            info: jest.fn()
        };
        const request = new request_1.Request(KUBECONFIG);
        const result = yield watcher.watch(SOME_DOCUMENT, callbackMock, doneMock);
        expect(result).toEqual(expect.any(Object));
        expect(result.request).toEqual(request.requestMock);
        expect(result.disposer).toEqual(expect.any(Function));
        result.disposer();
        expect(request.abortMock).toBeCalled();
    }));
});
//# sourceMappingURL=watch.unit.js.map