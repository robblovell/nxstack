import { Symbols, container } from '../'
import { commonStoreTests } from './common'
import { IEntity } from '../../src/DI/interfaces'

describe('EntityList', () => {

    commonStoreTests(Symbols.stores.someEntityList, 'entityList')

    describe('General', () => {
        let store: IEntity
        beforeAll(() => {
            store = container.get(Symbols.stores.someEntityList)
            store.service.loadMockData(mockData)
        })

        test('fetch should return data', async () => {
            await store.fetch()
            expect(store.entities.length).toBeGreaterThan(0)
        })

        test('should have generated entityStores', () => {
            expect(store.entityStores).toBeDefined()

            expect(store.total).toBe(mockData.length)
            expect(store.skip).toBe(-1)
            expect(store.limit).toBe(-1)
            // TODO: Replace forEach
            store.entityStores.forEach((entityStore, index) => {
                expect(entityStore.id).toBeDefined()
                expect(entityStore.entity).toBeDefined()
                expect(entityStore.id).toBe(mockData[index]._id)
                expect(entityStore.entity).toMatchObject(mockData[index])
            })
        })

        test.skip('get should return exact entity', async () => {
            const index = Math.floor(Math.random() * (mockData.length - 1)) + 1

            const entityStore = store.newStore()
            const item = await entityStore.get(mockData[index]._id)
            expect(item).toMatchObject(mockData[index])
        })
    })

    describe('Paging', () => {
        let store: IEntity
        beforeAll(() => {
            store = container.get(Symbols.stores.someEntityList)
            store.service.loadMockData(mockData)
        })

        beforeEach(async () => {
            store.reset()
            await store.fetch()
        })

        test('page through all elements', async () => {
            while (store.hasMore) {
                store.limit = 1
                const limit = store.limit
                const count = store.entities.length
                await store.next()
                expect(store.entities.length).toBe(count + limit)
            }
        })

        // TODO: get rid of setTimeout.
        test('skip should skip x entities', (done) => {
            const skipCount = Math.floor(Math.random() * (mockData.length - 1)) + 1

            store.skip = skipCount

            // Need to pause for the entityStores to load
            setTimeout(() => {
                expect(store.entityStores[0].entity).toMatchObject(mockData[skipCount])
                done()
            }, 300)
        })

        // TODO: get rid of setTimeout.
        test('limit should fetch x entities', async (done) => {
            const limitCount = Math.floor(Math.random() * (mockData.length - 1)) + 1

            store.skip = 0
            store.limit = limitCount

            // Need to pause for the entityStores to load
            setTimeout(() => {
                expect(store.entities.length).toBe(limitCount)
                done()
            }, 300)
        })
    })
})


const mockData = [{
    '_id': 1,
    'first_name': 'Ricki',
    'last_name': 'Dowding',
    'email': 'rdowding0@163.com',
    'gender': 'Female',
    'ip_address': '101.34.99.180'
}, {
    '_id': 2,
    'first_name': 'Adrea',
    'last_name': 'Schoenleiter',
    'email': 'aschoenleiter1@dion.ne.jp',
    'gender': 'Female',
    'ip_address': '47.214.117.156'
}, {
    '_id': 3,
    'first_name': 'Myrtle',
    'last_name': 'Golt',
    'email': 'mgolt2@biglobe.ne.jp',
    'gender': 'Female',
    'ip_address': '250.93.33.144'
}, {
    '_id': 4,
    'first_name': 'Jesse',
    'last_name': 'Glennie',
    'email': 'jglennie3@nifty.com',
    'gender': 'Female',
    'ip_address': '23.51.123.79'
}, {
    '_id': 5,
    'first_name': 'Berny',
    'last_name': 'Billows',
    'email': 'bbillows4@ucoz.com',
    'gender': 'Male',
    'ip_address': '72.112.149.211'
}, {
    '_id': 6,
    'first_name': 'Gilles',
    'last_name': 'Dennes',
    'email': 'gdennes5@exblog.jp',
    'gender': 'Male',
    'ip_address': '220.92.165.172'
}, {
    '_id': 7,
    'first_name': 'Ann',
    'last_name': 'Bouskill',
    'email': 'abouskill6@about.me',
    'gender': 'Female',
    'ip_address': '69.29.223.207'
}, {
    '_id': 8,
    'first_name': 'Hildagarde',
    'last_name': 'Balle',
    'email': 'hballe7@vinaora.com',
    'gender': 'Female',
    'ip_address': '101.72.28.124'
}, {
    '_id': 9,
    'first_name': 'Silva',
    'last_name': 'Ramsdell',
    'email': 'sramsdell8@jigsy.com',
    'gender': 'Female',
    'ip_address': '123.96.43.189'
}, {
    '_id': 10,
    'first_name': 'Theressa',
    'last_name': 'Ivanikhin',
    'email': 'tivanikhin9@cnn.com',
    'gender': 'Female',
    'ip_address': '71.235.142.80'
}]