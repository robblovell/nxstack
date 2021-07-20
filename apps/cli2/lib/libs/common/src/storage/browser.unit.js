"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const browser_1 = require("./browser");
jest.mock('inversify');
const SOME_KEY = 'key';
const SOME_VALUE = 'value';
jest.mock('localstorage-memory', () => {
    return {
        key: jest.fn().mockReturnValue('key'),
        getItem: jest.fn().mockReturnValue('value'),
        setItem: jest.fn().mockReturnValue(true),
        removeItem: jest.fn().mockReturnValue(false),
        clear: jest.fn().mockReturnValue(false),
    };
});
const LocalStorage = tslib_1.__importStar(require("localstorage-memory"));
describe('BrowserStorage Class', () => {
    test('BrowserStorage construction', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        expect(() => {
            new browser_1.BrowserStorage();
        }).not.toThrow();
    }));
    test('key = (n)', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const storage = new browser_1.BrowserStorage();
        storage.key(0);
        expect(LocalStorage.key).toBeCalledWith(0);
    }));
    test('getItem = <T>(key)', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const storage = new browser_1.BrowserStorage();
        expect(storage.getItem(SOME_KEY)).toEqual(SOME_VALUE);
        expect(LocalStorage.getItem).toBeCalledWith(SOME_KEY);
    }));
    test('setItem = <T>(key)', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const storage = new browser_1.BrowserStorage();
        expect(storage.setItem(SOME_KEY, SOME_VALUE)).toBe(true);
        expect(LocalStorage.setItem).toBeCalledWith(SOME_KEY, SOME_VALUE);
    }));
    test('removeItem = (key: string)', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const storage = new browser_1.BrowserStorage();
        storage.removeItem(SOME_KEY);
        expect(storage.removeItem(SOME_KEY)).toBeFalsy();
        expect(LocalStorage.removeItem).toBeCalledWith(SOME_KEY);
    }));
    test('clear = ()', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const storage = new browser_1.BrowserStorage();
        expect(storage.clear()).toBeFalsy();
        expect(LocalStorage.clear).toBeCalled();
    }));
});
//# sourceMappingURL=browser.unit.js.map