import { WebConfig } from './WebConfig'
jest.mock('inversify')
jest.mock('debug', () => {
    return jest.fn()
})
import createDebug from 'debug'

describe('WebConfig ', () => {

    const SOME_KEY = 'key'
    const SOME_VALUE = 'value'

    beforeEach(() => {
        jest.clearAllMocks()
    })

    test ('WebConfig constructor...', async () => {
        const webConfig = new WebConfig()
        expect(webConfig).toBeDefined()
    })

    test ('WebConfig envVars(), no c6oEnv', async () => {
        const webConfig = new WebConfig()
        expect(webConfig.envVars).toEqual(undefined)
    })

    test ('WebConfig envVars() with c60Env', async () => {
        const _global = (window /* browser */ || global /* node */ ) as any
        const someEnv = { test: 'test' }
        _global['c6oEnv'] = someEnv
        const webConfig = new WebConfig()
        expect(webConfig.envVars).toEqual(someEnv)
    })

    // TODO:: test win = win.parent...
    test.skip ('WebConfig envVars(), more than one window', async () => {
        const _global = (window /* browser */ || global /* node */ ) as any
        const someEnv = { test: 'test' }
        _global.parent = { 'c6oEnv': someEnv }
        delete _global['c6oEnv']

        const webConfig = new WebConfig()
        expect(webConfig.envVars).toEqual(someEnv)
    })

    describe ('get(key: string): string ', () => {

        expect(createDebug).toBeCalledWith('common:config:web')

        test('get(key: string): string no envVars', async () => {
            const webConfig = new WebConfig()
            expect(webConfig.get(SOME_KEY)).toBeUndefined()
        })

        test('get(key: string): string normal case', async () => {
            const _global = (window /* browser */ || global /* node */) as any

            const webConfig = new WebConfig()
            const someEnv = { key: SOME_VALUE }
            _global['c6oEnv'] = someEnv
            expect(webConfig.get(SOME_KEY)).toBe(SOME_VALUE)
            expect(webConfig.get('SOME_KEY')).toBeUndefined()
        })

        test('get(key: string): string throws on error', async () => {
            const _global = (window /* browser */ || global /* node */ ) as any
            delete _global['c6oEnv']
            const webConfig = new WebConfig()

            expect(() => webConfig.get(SOME_KEY)).not.toThrow()
        })
    })

    test('has = (key: string) => ', async () => {
        const SOME_KEY = 'key'
        const _global = (window /* browser */ || global /* node */) as any

        const webConfig = new WebConfig()
        const someEnv = { key: SOME_VALUE }
        _global['c6oEnv'] = someEnv

        expect(webConfig.has(SOME_KEY)).toBe(true)
        expect(webConfig.has('SOME_KEY')).toBe(false)
    })
})
