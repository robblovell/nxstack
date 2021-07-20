import { MemoryStorage } from './memory'

jest.mock('inversify')
const SOME_KEY = 'key1'
const SOME_VALUE = 'value1'
const SOME_OTHER_KEY = 'key2'
const SOME_OTHER_VALUE = 'value2'
import * as LocalStorage from 'localstorage-memory'

describe('MemoryStorage Class', () => {
    const storage = new MemoryStorage()
    storage['storage'] = {
        key1: SOME_VALUE,
    }

    test('MemoryStorage construction', async () => {
        expect(() => {
            new MemoryStorage()
        }).not.toThrow()
    })

    test('key = (n)', async () => {
        expect(storage.key(0)).toBe(SOME_KEY)
    })

    test('getItem = <T>(key)', async () => {
        expect(storage.getItem(SOME_KEY)).toEqual(SOME_VALUE)
    })

    test('setItem = <T>(key)', async () => {
        expect(storage.setItem(SOME_OTHER_KEY, SOME_OTHER_VALUE)).toBeTruthy()
        expect(storage['storage'][SOME_OTHER_KEY]).toEqual(SOME_OTHER_VALUE)
    })

    test('removeItem = (key: string)', async () => {
        const storage = new MemoryStorage()
        storage['storage'] = {
            key1: SOME_VALUE,
        }
        expect(storage.removeItem(SOME_KEY)).toBeTruthy()
        expect(storage['storage'][SOME_KEY]).toBeUndefined()
    })

    test('clear = ()', async () => {
        const storage = new MemoryStorage()
        storage['storage'] = {
            key1: SOME_VALUE,
            key2: SOME_OTHER_VALUE,
        }
        expect(storage.clear()).toBeUndefined()
        expect(storage['storage']).toEqual({})
    })
})
