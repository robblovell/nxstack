import { TestUtils } from './testUtils'

describe('TestUtils Class', () => {

    test('static render(tag, attributes = {})', async () => {
        const attributes = { foo: "bar", baz: "foo" }
        const tag = 'tag'
        const expectedResult = ' foo="bar" baz="foo"'
        document.querySelector = jest.fn().mockReturnValue(expectedResult)
        const result = await TestUtils.render(tag, attributes)
        expect(result).toBe(expectedResult)
    })

    test('TestUtils static _renderToDocument(tag, attributes)',  () => {
        const attributes = { foo: "bar", baz: "foo" }
        const tag = 'tag'
        TestUtils._renderToDocument(tag, attributes)
        expect(document.body.innerHTML).toEqual(`<${tag} foo="bar" baz="foo"></${tag}>`)
    })

    test('TestUtils static _mapObjectToHTMLAttributes(attributes)', () => {
        const attributes = { foo: "bar", baz: "foo" }
        const result = TestUtils._mapObjectToHTMLAttributes(attributes)
        expect(result).toBe(' foo="bar" baz="foo"')
    })

    test('TestUtils static async _waitForComponentToRender(tag) found case', async () => {
        const tag = 'tag'
        document.querySelector = jest.fn().mockReturnValue(tag)
        await expect(TestUtils._waitForComponentToRender(tag)).resolves.toBe(tag)
    })

    // TODO: this hangs and never returns because it doesn't resolve!
    test.skip('TestUtils static async _waitForComponentToRender(tag) not found case', async () => {
        const tag = 'tag'
        window.requestAnimationFrame = jest.fn()
        document.querySelector = jest.fn().mockReturnValue(undefined)
        await expect(TestUtils._waitForComponentToRender(tag)).resolves.toBe('')
    })
})
