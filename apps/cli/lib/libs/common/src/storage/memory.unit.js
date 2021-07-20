"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const memory_1 = require("./memory");
jest.mock('inversify');
const SOME_KEY = 'key1';
const SOME_VALUE = 'value1';
const SOME_OTHER_KEY = 'key2';
const SOME_OTHER_VALUE = 'value2';
describe('MemoryStorage Class', () => {
    const storage = new memory_1.MemoryStorage();
    storage['storage'] = {
        key1: SOME_VALUE,
    };
    test('MemoryStorage construction', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        expect(() => {
            new memory_1.MemoryStorage();
        }).not.toThrow();
    }));
    test('key = (n)', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        expect(storage.key(0)).toBe(SOME_KEY);
    }));
    test('getItem = <T>(key)', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        expect(storage.getItem(SOME_KEY)).toEqual(SOME_VALUE);
    }));
    test('setItem = <T>(key)', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        expect(storage.setItem(SOME_OTHER_KEY, SOME_OTHER_VALUE)).toBeTruthy();
        expect(storage['storage'][SOME_OTHER_KEY]).toEqual(SOME_OTHER_VALUE);
    }));
    test('removeItem = (key: string)', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const storage = new memory_1.MemoryStorage();
        storage['storage'] = {
            key1: SOME_VALUE,
        };
        expect(storage.removeItem(SOME_KEY)).toBeTruthy();
        expect(storage['storage'][SOME_KEY]).toBeUndefined();
    }));
    test('clear = ()', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const storage = new memory_1.MemoryStorage();
        storage['storage'] = {
            key1: SOME_VALUE,
            key2: SOME_OTHER_VALUE,
        };
        expect(storage.clear()).toBeUndefined();
        expect(storage['storage']).toEqual({});
    }));
});
//# sourceMappingURL=memory.unit.js.map