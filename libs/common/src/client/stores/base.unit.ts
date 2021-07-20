import {BaseServiceStore} from './base'
import {IFeathersServiceFactory} from '../../DI/interfaces'

describe('BaseServiceStore Class', () => {
    const someName = 'some name'
    const someField = 'some field'
    const someMessage = 'some message'

    beforeEach(() => {
        // Clear all instances and calls to constructor and all methods:
        jest.clearAllMocks()
    })

    test('BaseServiceStore constructor', async () => {
        const instance: BaseServiceStore = new BaseServiceStore(someName)
        expect(instance.serviceName).toBe(someName)
        expect(instance.errors).toEqual({})
        expect(instance.feathersServiceFactory).toBe(undefined)
        expect(instance.serviceName).toEqual(someName)
    })

    describe('success and failed()', () => {
        test('BaseServiceStore success', async () => {
            const instance: BaseServiceStore = new BaseServiceStore(someName)
            instance['errors'] = {} as any
            expect(instance.isValid).toBeTruthy()
        })
        test('BaseServiceStore success fails', async () => {
            const instance: BaseServiceStore = new BaseServiceStore(someName)
            instance['errors'] = {error:'error'}as any
            expect(instance.isValid).toBeFalsy()
        })
    })

    test('Init calls create service', async () => {
        const instance = new BaseServiceStore(someName)
        const stub = jest.fn()
        instance.createService = stub
        instance.init()
        expect(stub).toHaveBeenCalled()
        expect(instance.feathersServiceFactory).toBe(undefined)
    })

    describe('createService()', () => {
        test('CreateService returns if the service is already created', async () => {
            const instance = new BaseServiceStore(someName)
            expect(instance.feathersServiceFactory).toBe(undefined)
            instance.serviceName = undefined
            const result = instance.createService()
            expect(result).toBe(false)
        })

        test('CreateService throws an error if the feather service factory is not available.', async () => {
            const instance = new BaseServiceStore(someName)
            expect(instance.feathersServiceFactory).toBe(undefined)
            expect(() => {
                instance.createService()
            }).toThrow('A Feathers service factory is required')
        })

        test('CreateService calls createService using the feathers service factory.', async () => {
            const stub = {
                createService: (name: string) => {
                    return name
                }
            }
            jest.spyOn(stub, 'createService')
            const instance = new BaseServiceStore(someName)

            instance.feathersServiceFactory = stub as unknown as IFeathersServiceFactory
            const result = instance.createService()
            expect(result).toBe(true)
            expect(stub.createService).toHaveBeenCalledTimes(1)
        })
    })

    test('reset sets errors to an empty structure.', async () => {
        const instance = new BaseServiceStore(someName)
        instance.setError(someField, someMessage)
        expect(instance.errors[someField]).toEqual({'message': someMessage})
        instance.reset()
        expect(instance.errors).toEqual({})
    })

    test('setError creates a new error and calls Object.assign with field:message passed in', async () => {
        const instance = new BaseServiceStore(someName)
        instance.setError(someField, someMessage)
        expect(instance.errors[someField]).toEqual({'message': someMessage})
        instance.setError(someField + '1', someMessage + '1')
        expect(instance.errors[someField]).toEqual({'message': someMessage})
        expect(instance.errors[someField + '1']).toEqual({'message': someMessage + '1'})
    })

    test('setError changes an existing error. ', async () => {
        const instance = new BaseServiceStore(someName)
        instance.setError(someField, someMessage)
        instance.setError(someField + '1', someMessage + '1')
        instance.setError(someField, someMessage + '2')
        instance.setError(someField + '1', someMessage + '3')
        expect(instance.errors[someField]).toEqual({'message': someMessage + '2'})
        expect(instance.errors[someField + '1']).toEqual({'message': someMessage + '3'})
    })

    test('ClearError deletes the specific error by the field name.', async () => {
        const instance = new BaseServiceStore(someName)
        instance.setError(someField, someMessage)
        instance.setError(someField + '1', someMessage + '1')
        expect(instance.errors[someField]).toEqual({'message': someMessage})
        expect(instance.errors[someField + '1']).toEqual({'message': someMessage + '1'})
        instance.clearError(someField)
        expect(instance.errors[someField]).toBeUndefined()
        expect(instance.errors[someField + '1']).toEqual({'message': someMessage + '1'})
        instance.clearError(someField + '1')
        expect(instance.errors[someField + '1']).toBeUndefined()
    })
})