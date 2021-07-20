jest.mock('./base')
import { EntityListStore } from './entityList'
import { BaseServiceStore } from './base'
import { ServiceMethods } from '@feathersjs/feathers'
import { Logger } from '@c6o/logger'
import { toJS } from 'mobx'

import {  container } from '../../'

jest.mock('../../DI/container', () => {
    return {
        container: {
            get: jest.fn()
        },
    }
})

describe('EntityListStore', () => {
    const someName = 'someName'
    const someValue = 'someValue'
    const someSymbol = Symbol(someName)
    const someFunction = jest.fn()
    const someLogger: Logger = {
        info: () => {
            return
        },
        error: () => {
            return
        }
    } as Logger

    beforeEach(() => {
        // Clear all instances and calls to constructor and all methods:
        jest.clearAllMocks()
    })

    test('EntityListStore Store Constructor', async () => {
        // TODO: test the second parameter.
        const instance = new EntityListStore(someName, someSymbol)
        expect(BaseServiceStore).toHaveBeenCalledTimes(1)
        expect(BaseServiceStore).toHaveBeenCalledWith(someName)
        expect(instance['entityStoreSymbol']).toEqual(someSymbol)
    })

    describe('Init()', () => {
        test('Init calls super init and initializes the service methods.', async () => {
            const instance = new EntityListStore(someName, someSymbol)
            const initStub = jest.fn()

            BaseServiceStore.prototype.init = initStub
            expect(instance['service']).toBeUndefined()
            const methods = { updated: 0, patched: 0, removed: 0, created: 0 }
            const stub = {
                on: (method, func) => {
                    expect(typeof func).toEqual('function')
                    methods[method]++
                }
            }
            jest.spyOn(stub, 'on')

            instance['service'] = stub as unknown as ServiceMethods<never>
            instance.init()
            expect(BaseServiceStore).toHaveBeenCalledTimes(1)
            expect(BaseServiceStore).toHaveBeenCalledWith(someName)
            expect(initStub).toHaveBeenCalled()
            expect(instance.feathersServiceFactory).toBe(undefined)
            expect(stub.on).toHaveBeenCalledTimes(4)
            expect(methods.updated).toBe(1)
            expect(methods.patched).toBe(1)
            expect(methods.removed).toBe(1)
            expect(methods.created).toBe(1)
        })
    })

    describe('findIndex()', () => {
        const someEntities = [{ _id: 1 }, { _id: 2 }]
        const instance = new EntityListStore(someName, someSymbol)
        instance.entities = someEntities

        test('returns the index of an entity that exists.', async () => {
            const index1 = instance['findIndex']({ _id: 1 })
            expect(index1).toEqual(0)
            const index2 = instance['findIndex']({ _id: 2 })
            expect(index2).toEqual(1)
        })
        test('returns -1 if the entity does not exist.', async () => {
            const index1 = instance['findIndex']({ _id: 0 })
            expect(index1).toEqual(-1)
        })
    })

    describe('getStore()', () => {
        test('returns existing store with and entity, by id.', async () => {
            const someEntity = { _id: 1, stuff: someValue }
            const someEntityStore = {
                entity: someEntity,
                hasEntity: true,
                loading: false,
                get: async () => {
                    return someEntity
                }
            }
            const someEntities = [someEntityStore]
            const instance = new EntityListStore(someName, someSymbol)
            instance['logger'] = someLogger
            const newStoreStub = jest.fn().mockImplementation(() => {
                return someEntityStore
            })
            instance.entities = someEntities
            instance.newStore = newStoreStub

            const store = await instance.getStore(0)
            expect(store).toEqual(someEntityStore)
        })
        test('returns existing store without and entity, by id.', async () => {
            const someEntity = { _id: 1, stuff: someValue }
            const someOtherEntity = { _id: 2, stuff: someValue + '1' }
            const someEntityStore = {
                entity: someEntity,
                hasEntity: false,
                loading: false,
                get: () => {
                    someEntityStore.entity = someOtherEntity
                }
            }
            const getEntityStoreStub = jest.fn().mockImplementation(() => {
                return [someEntityStore]
            })
            const someEntities = [someEntityStore]
            const instance = new EntityListStore(someName, someSymbol)
            instance['logger'] = someLogger
            const newStoreStub = jest.fn().mockImplementation(() => {
                return someEntityStore
            })
            instance['entities'] = someEntities
            instance.newStore = newStoreStub
            instance['getEntityStore'] = getEntityStoreStub
            const store = await instance.getStore(0)
            expect(store.entity).toEqual(someOtherEntity)
        })
    })

    describe('has functions hasEntities() and hasMore()', () => {
        test('hasEntities()', async () => {
            const instance = new EntityListStore(someName, someSymbol)
            instance.entities = []
            expect(instance.hasEntities).toBeFalsy()
            instance.entities = [someValue]
            expect(instance.hasEntities).toBeTruthy()
            instance.entities = [someValue, someValue]
            expect(instance.hasEntities).toBeTruthy()
        })
        test('hasMore() has more', async () => {
            const instance = new EntityListStore(someName, someSymbol)
            instance.entities = [someValue]
            instance['total'] = 3
            expect(instance.hasMore).toBeTruthy()
        })
        test('hasMore() has more', async () => {
            const instance = new EntityListStore(someName, someSymbol)
            instance.entities = [someValue]
            instance['total'] = 1
            expect(instance.hasMore).toBeFalsy()
        })
    })

    describe('has function hasFilter()', () => {

        test('hasFilter() has more', async () => {
            const instance = new EntityListStore(someName, someSymbol)
            instance.filter = {
                key1: 'key1',
                key2: 'key2',
            }
            expect(instance.hasFilter).toBeTruthy()
            instance.filter['$sort'] = 'sort'
            expect(instance.hasFilter).toBeTruthy()
            instance.filter = {
                '$sort': 'key1',
            }
            expect(instance.hasFilter).toBeFalsy()
            instance.filter = {}
            expect(instance.hasFilter).toBeFalsy()
        })
    })

    describe('get initialized(), nullState', () => {
        test('initialized()', async () => {
            const instance = new EntityListStore(someName, someSymbol)
            instance['state'] = 'error'
            expect(instance.initialized).toBeTruthy()
            instance['state'] = 'uninitialized'
            expect(instance.initialized).toBeFalsy()
            instance['state'] = 'unfiltered'
            expect(instance.initialized).toBeTruthy()
            instance['state'] = 'something' as any
            expect(instance.initialized).toBeTruthy()
        })

        test('nullState()', async () => {
            const instance = new EntityListStore(someName, someSymbol)
            instance.entities = []
            expect(instance.hasEntities).toBeFalsy()

            instance['state'] = 'error'
            expect(instance.nullState).toBeFalsy()
            instance['state'] = 'uninitialized'
            expect(instance.nullState).toBeFalsy()
            instance['state'] = 'unfiltered'
            expect(instance.nullState).toBeTruthy()
            instance['state'] = 'something' as any
            expect(instance.nullState).toBeFalsy()

            instance.entities = [someValue]
            expect(instance.hasEntities).toBeTruthy()

            instance['state'] = 'error'
            expect(instance.nullState).toBeFalsy()
            instance['state'] = 'uninitialized'
            expect(instance.nullState).toBeFalsy()
            instance['state'] = 'unfiltered'
            expect(instance.nullState).toBeFalsy()
            instance['state'] = 'something' as any
            expect(instance.nullState).toBeFalsy()
        })

    })

    test('reset()', async () => {
        const instance = new EntityListStore(someName, someSymbol)
        instance.limit = instance.skip = instance.total = 1
        instance.reset()
        expect(instance.limit).toEqual(-1)
        expect(instance.skip).toEqual(-1)
        expect(instance.total).toEqual(-1)
    })

    test('_preServiceRequest()', async () => {
        const instance = new EntityListStore(someName, someSymbol)
        instance.busy = false
        instance.errors = { error: 'something' } as any
        instance['_preServiceRequest']()
        expect(instance.busy).toBe(true)
        expect(instance.clearErrors).toBeCalled()
    })

    test('_postServiceRequest()', async () => {
        const instance = new EntityListStore(someName, someSymbol)
        instance.busy = true
        instance['_postServiceRequest']()
        expect(instance.busy).toBe(false)
    })

    test('queryHook()', async () => {
        const instance = new EntityListStore(someName, someSymbol)
        expect(instance.queryHook()).toEqual({})
    })

    test('newStore()', async () => {
        const instance = new EntityListStore(someName, someSymbol)
        instance.newStore()
        expect(container.get).toBeCalledWith(instance.entityStoreSymbol)
    })
    describe('queryHash(query) && isDifferent(query) && saveQuery(query)', () => {

        test('queryHash(query)', async () => {
            const instance = new EntityListStore(someName, someSymbol)
            const NEXT_QUERY = { key1: 'value', key2: true, key3: 1 }
            instance.limit = 50
            instance.skip = 25
            expect(instance.queryHash(NEXT_QUERY)).toEqual(JSON.stringify(
                toJS({
                    ...NEXT_QUERY,
                    $limit: 50,
                    $skip: 25
                })))
        })

        test('isDifferent(query)', async () => {
            const instance = new EntityListStore(someName, someSymbol)
            instance['lastQuery'] = undefined
            expect(instance.isDifferent('current query')).toBeTruthy()

            const CURRENT_QUERY = { key1: 'value', key2: true, key3: 1 }
            instance.saveQuery(CURRENT_QUERY)
            expect(instance.isDifferent(CURRENT_QUERY)).toBeFalsy()

            const LAST_QUERY1 = { key1: 'value2', key2: false, key3: 2 }
            instance.saveQuery(LAST_QUERY1)
            expect(instance.isDifferent(CURRENT_QUERY)).toBeTruthy()

            const LAST_QUERY2 = { nonkey1: 'value', nonkey2: true, nonkey3: 1 }
            instance.saveQuery(LAST_QUERY2)
            expect(instance.isDifferent(CURRENT_QUERY)).toBeTruthy()

            const LAST_QUERY3 = { nonkey1: 'value2', nonkey2: false, nonkey3: 2 }
            instance.saveQuery(LAST_QUERY3)
            expect(instance.isDifferent(CURRENT_QUERY)).toBeTruthy()
        })

        test('saveQuery(query)', async () => {
            const instance = new EntityListStore(someName, someSymbol)
            instance['lastQuery'] = undefined
            const CURRENT_QUERY = { key1: 'value', key2: true, key3: 1 }
            instance.saveQuery(CURRENT_QUERY)
            expect(instance['lastQuery']).toEqual(JSON.stringify(
                toJS({
                    ...CURRENT_QUERY,
                    $limit: instance.limit,
                    $skip: instance.skip
                })))
            const NEXT_QUERY = { key1: 'value', key2: true, key3: 1 }
            instance.limit = 50
            instance.skip = 25
            instance.saveQuery(NEXT_QUERY)
            expect(instance['lastQuery']).toEqual(JSON.stringify(
                toJS({
                    ...NEXT_QUERY,
                    $limit: 50,
                    $skip: 25
                })))
        })
    })

    describe('disposing', () => {
        test('dispose() not null filterDisposer', async () => {
            const instance = new EntityListStore(someName, someSymbol)
            const disposable = [{ dispose: jest.fn() }, { dispose: jest.fn() }]
            instance['filterDisposer'] = someFunction
            instance['_entityStores'] = disposable

            BaseServiceStore['dispose'] = jest.fn()
            instance.dispose()
            expect(someFunction).toHaveBeenCalledTimes(1)
            expect(instance['filterDisposer']).toBeUndefined()
            expect(disposable[0].dispose).toHaveBeenCalledTimes(1)
            expect(disposable[1].dispose).toHaveBeenCalledTimes(1)
        })
    })

    describe('entityStores', () => {
        const ENTITY1 = {
            _id: '1111',
            name: 'SomeName',
            namespace: 'somenamespace',
        }
        const ENTITY2 = {
            _id: '2222',
            name: 'AnotherName',
            namespace: 'anothernamespace',
            iaas: { status: 'error' },
        }
        const clustersStore1 = {
            entity: ENTITY1,
            id: ENTITY1._id,
            hasInstallError: false,
            dispose: jest.fn(),
        }
        const clustersStore2 = {
            entity: ENTITY2,
            id: ENTITY2._id,
            hasInstallError: true,
            dispose: jest.fn(),
        }

        let index = 0
        const MOCK_NEW_STORE = jest.fn()
            .mockImplementation(() => {
                return index++ % 2 === 0 ? clustersStore1 : clustersStore2
            })

        const store = new EntityListStore(someName, someSymbol)
        store['logger'] = {
            info: jest.fn()
        } as any
        store.newStore = MOCK_NEW_STORE

        it('has an entityStore computed', () => {
            store.entities = [ENTITY1, ENTITY2]
            const stores = store.entityStores
            expect(stores[0].entity).toEqual(ENTITY1)
            expect(stores[1].entity).toEqual(ENTITY2)
        })

        it('has an optimized entityStore computed', () => {
            store.entities = [ENTITY1, ENTITY2]
            expect(store.newStore).toBeCalledTimes(0)

            store.entityStores
            expect(store.newStore).toBeCalledTimes(2)

            // TODO: To get this test working we need a deep object
            // compare in the entityStores computed. E.g.
            //
            // this.entities !== this._entityStores ||
            // this.entities.length !== this._entityStores.length ||
            // this.entities.some((entity, index) => entity != this._entityStores[index].entity)
            //
            // MOCK_NEW_STORE.mockClear()
            // store.entityStores
            // expect(store.newStore).toBeCalledTimes(0)
        })
    })
})
