import { Symbols, container } from '../'
import { commonStoreTests } from './common'

describe('EntityStore', () => {

    commonStoreTests(Symbols.stores.someEntity, 'entity')

    test('id set when entity is set', () => {
        const id = 'this is some id'
        const store:any = container.get(Symbols.stores.someEntity)

        store.entity = { _id: id }
        expect(store.id).toBe(id)
    })

    test('get is called when id is set', async () => {
        const id = 'this is some id'
        const store:any = container.get(Symbols.stores.someEntity)

        store.id = id
        expect(store.service.get).toHaveBeenCalled()
    })

    describe('CRUD', () => {
        let store:any

        const createEntity:any = {
            foo: 'bar'
        }
        const saveEntity:any = {
            car: 'toon'
        }

        beforeAll(() => store = container.get(Symbols.stores.someEntity))

        test('create entity', async () => {
            store.pending = createEntity
            await store.create()
            expect(store.entity).toEqual(expect.objectContaining(createEntity))
        })

        test('save entity', async () => {
            store.pending = {
                _id: store.entity._id,
                ...saveEntity
            }

            store.service.patch.mockClear()
            await store.save()

            expect(store.service.patch).toBeCalled()
            expect(store.entity).toMatchObject({
                _id: store.entity._id,
                ...saveEntity
            })

        })

        test('patch entity', async () => {
            store.service.patch.mockClear()
            store.pending = createEntity
            await store.patch()

            expect(store.service.patch).toBeCalled()
            expect(store.entity).toMatchObject({
                _id: store.entity._id,
                ...saveEntity,
                ...createEntity
            })
        })

        test('remove entity', async () => {
            store.service.remove.mockClear()
            await store.remove()

            expect(store.service.remove).toBeCalled()
            expect(store.entity.removed).toEqual(true)
        })

        test.todo('get tests')
        test.todo('multiple entities and swapping entities tests')
    })

})
