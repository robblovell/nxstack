"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const testUtils_1 = require("./testUtils");
describe('TestUtils Class', () => {
    test('static render(tag, attributes = {})', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const attributes = { foo: "bar", baz: "foo" };
        const tag = 'tag';
        const expectedResult = ' foo="bar" baz="foo"';
        document.querySelector = jest.fn().mockReturnValue(expectedResult);
        const result = yield testUtils_1.TestUtils.render(tag, attributes);
        expect(result).toBe(expectedResult);
    }));
    test('TestUtils static _renderToDocument(tag, attributes)', () => {
        const attributes = { foo: "bar", baz: "foo" };
        const tag = 'tag';
        testUtils_1.TestUtils._renderToDocument(tag, attributes);
        expect(document.body.innerHTML).toEqual(`<${tag} foo="bar" baz="foo"></${tag}>`);
    });
    test('TestUtils static _mapObjectToHTMLAttributes(attributes)', () => {
        const attributes = { foo: "bar", baz: "foo" };
        const result = testUtils_1.TestUtils._mapObjectToHTMLAttributes(attributes);
        expect(result).toBe(' foo="bar" baz="foo"');
    });
    test('TestUtils static async _waitForComponentToRender(tag) found case', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const tag = 'tag';
        document.querySelector = jest.fn().mockReturnValue(tag);
        yield expect(testUtils_1.TestUtils._waitForComponentToRender(tag)).resolves.toBe(tag);
    }));
    test.skip('TestUtils static async _waitForComponentToRender(tag) not found case', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const tag = 'tag';
        window.requestAnimationFrame = jest.fn();
        document.querySelector = jest.fn().mockReturnValue(undefined);
        yield expect(testUtils_1.TestUtils._waitForComponentToRender(tag)).resolves.toBe('');
    }));
});
//# sourceMappingURL=testUtils.unit.js.map