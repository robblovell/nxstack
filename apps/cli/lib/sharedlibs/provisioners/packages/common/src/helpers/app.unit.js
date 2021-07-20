"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const app_1 = require("./app");
describe('AppHelper', () => {
    describe('AppHelper static functions', () => {
        test('from template no namespace', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            const someValue = 'foo';
            const result = app_1.AppHelper.template(undefined, someValue);
            expect(result).toBeDefined();
            expect(result.metadata.name).toEqual(someValue);
            expect(result.metadata.namespace).toBeUndefined();
        }));
        test('from template no name', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            const someValue = 'foo';
            const result = app_1.AppHelper.template(someValue);
            expect(result).toBeDefined();
            expect(result.metadata.namespace).toEqual(someValue);
            expect(result.metadata.name).toBeUndefined();
        }));
        test('from template', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            const someValue = 'foo';
            const someOtherValue = 'bar';
            const result = app_1.AppHelper.template(someValue, someOtherValue);
            expect(result).toBeDefined();
            expect(result.metadata.namespace).toEqual(someValue);
            expect(result.metadata.name).toEqual(someOtherValue);
        }));
    });
});
//# sourceMappingURL=app.unit.js.map