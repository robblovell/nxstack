import { BrowserStorage } from './browser'

jest.mock('inversify')
const SOME_KEY = 'key'
const SOME_VALUE = 'value'
jest.mock('localstorage-memory', () => {
    return {
        key: jest.fn().mockReturnValue('key'), // gets hoisted, so we can't reference SOME_KEY.
        getItem: jest.fn().mockReturnValue('value'),// gets hoisted, so we can't reference SOME_VALUE.
        setItem: jest.fn().mockReturnValue(true),
        removeItem: jest.fn().mockReturnValue(false),
        clear: jest.fn().mockReturnValue(false),
    }
})
import * as LocalStorage from 'localstorage-memory'

describe('BrowserStorage Class', () => {

    test('BrowserStorage construction', async () => {
        expect(() => {
            new BrowserStorage()
        }).not.toThrow()
    })

    test('key = (n)', async () => {
        const storage = new BrowserStorage()
        storage.key(0)
        expect(LocalStorage.key).toBeCalledWith(0)
    })

    test('getItem = <T>(key)', async () => {
        const storage = new BrowserStorage()
        expect(storage.getItem(SOME_KEY)).toEqual(SOME_VALUE)
        expect(LocalStorage.getItem).toBeCalledWith(SOME_KEY)
    })

    test('setItem = <T>(key)', async () => {
        const storage = new BrowserStorage()
        expect(storage.setItem(SOME_KEY, SOME_VALUE)).toBe(true)
        expect(LocalStorage.setItem).toBeCalledWith(SOME_KEY, SOME_VALUE)
    })

    test('removeItem = (key: string)', async () => {
        const storage = new BrowserStorage()
        storage.removeItem(SOME_KEY)
        expect(storage.removeItem(SOME_KEY)).toBeFalsy()
        expect(LocalStorage.removeItem).toBeCalledWith(SOME_KEY)
    })

    test('clear = ()', async () => {
        const storage = new BrowserStorage()
        expect(storage.clear()).toBeFalsy()
        expect(LocalStorage.clear).toBeCalled()
    })
})
