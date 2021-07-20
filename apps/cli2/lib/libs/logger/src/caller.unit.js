"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const caller_1 = require("./caller");
jest.mock('callsite', () => {
    return jest.fn()
        .mockReturnValueOnce([
        null, null,
        {
            getFileName: jest.fn()
                .mockReturnValue(null)
        }
    ])
        .mockReturnValueOnce([
        null, null,
        {
            getLineNumber: jest.fn().mockReturnValue(1),
            getFileName: jest.fn()
                .mockReturnValue('/thing1/packages/thing2/lib/thing3'),
        }
    ])
        .mockReturnValueOnce([
        null, null, null, null, null,
        {
            getLineNumber: jest.fn().mockReturnValue(1),
            getFileName: jest.fn()
                .mockReturnValue('/thing1/packages/thing2/lib/thing3'),
        }
    ])
        .mockReturnValueOnce([
        null, null, null,
        {
            getLineNumber: jest.fn().mockReturnValue(1),
            getFileName: jest.fn()
                .mockReturnValue('/thing1/packages/thing2/thing3'),
        }
    ])
        .mockReturnValueOnce([
        null, null, null,
        {
            getLineNumber: jest.fn().mockReturnValue(1),
            getFileName: jest.fn()
                .mockReturnValue('/thing1/thing2/lib/thing3'),
        }
    ])
        .mockReturnValue([
        null, null, null,
        {
            getLineNumber: jest.fn().mockReturnValue(1),
            getFileName: jest.fn()
                .mockReturnValue('/thing1/thing2/thing3'),
        }
    ]);
});
describe('caller function', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    test('No requester obtained (call depth = 0)', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        expect(caller_1.caller(0)).toEqual({
            module: 'Anonymous',
            path: 'unknown',
            filename: 'unknown',
            line: -1,
        });
    }));
    test('Requester obtained (call depth = 0), index of ', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        expect(caller_1.caller(0)).toEqual({
            'filename': '/thing3',
            'line': 1,
            'module': ':thing2',
            'path': '/thing1/packages/thing2/lib/thing3',
        });
    }));
    test('Requester obtained (call depth = 1), index of ', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        expect(caller_1.caller(3)).toEqual({
            'filename': '/thing3',
            'line': 1,
            'module': ':thing2',
            'path': '/thing1/packages/thing2/lib/thing3',
        });
    }));
    test('Requester obtained (call depth = 1), missing lib', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        expect(caller_1.caller(1)).toEqual({
            'filename': '/thing1/packages/thing2/thing3',
            'line': 1,
            'module': ':thing2',
            'path': '/thing1/packages/thing2/thing3',
        });
    }));
    test('Requester obtained (call depth = 1), missing packages', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        expect(caller_1.caller(1)).toEqual({
            'filename': '/thing3',
            'line': 1,
            'module': ':thing1:thing2',
            'path': '/thing1/thing2/lib/thing3',
        });
    }));
    test('Requester obtained (call depth = 1), missing lib and packages', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        expect(caller_1.caller(1)).toEqual({
            'filename': '/thing1/thing2/thing3',
            'line': 1,
            'module': ':thing1:thing2',
            'path': '/thing1/thing2/thing3',
        });
    }));
});
//# sourceMappingURL=caller.unit.js.map