import { EntityStore } from './entity'
import { BaseServiceStore, StoreErrors } from './base'
import { ServiceMethods } from '@feathersjs/feathers'
import { Logger } from '@c6o/logger'

jest.mock('mobx')

describe('EntityStore', () => {
    const someName = 'someName'
    const someId = 'someId'
    const someValue = 'someValue'
    const someEntity = {_id: someId, value: someValue}
    const someField = 'someField'
    const someMessage = 'some message'
    const someErrorMessage = 'error'
    const someStoreError = { someField: someErrorMessage }
    const someObject = { someField: someValue }
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

    // TODO: something is wrong here, set just calls get and doesn't do anything else.
    describe('set(id)', () => {
        test.todo('set id')
    })

    test('Entity Store Constructor', async () => {
        const ParentOriginal = Object.getPrototypeOf(EntityStore)
        const ParentMock = jest.fn()
        Object.setPrototypeOf(EntityStore, ParentMock)
        new EntityStore(someName)

        expect(ParentMock).toHaveBeenCalledTimes(1)
        expect(ParentMock).toHaveBeenCalledWith(someName)
        Object.setPrototypeOf(EntityStore, ParentOriginal)
    })

    describe('Init()', () => {
        test('Init calls super init and initializes the service methods.', async () => {
            const instance = new EntityStore(someName)
            const initStub = jest.fn()
            BaseServiceStore.prototype.init = initStub
            expect(instance['service']).toBeUndefined()
            const methods = {updated: 0, patched: 0, removed: 0}
            const stub = {
                on: (method, func) => {
                    expect(typeof func).toEqual('function')
                    methods[method]++
                }
            }
            jest.spyOn(stub, 'on')

            instance['service'] = stub as unknown as ServiceMethods<never>
            instance.init()

            expect(initStub).toHaveBeenCalled()
            expect(instance.feathersServiceFactory).toBe(undefined)
            expect(stub.on).toHaveBeenCalledTimes(3)
            expect(methods.updated).toBe(1)
            expect(methods.patched).toBe(1)
            expect(methods.removed).toBe(1)
        })
    })

    describe('isMyEntity(entity)', () => {
        test('isMyEntity returns false if it is undefined.', async () => {
            const instance = new EntityStore(someName)
            expect(instance.entity).toBeUndefined()
            expect(instance.isMyEntity(null)).toBe(false)

        })
        test('isMyEntity returns true if it has a value or is the same exact entity.', async () => {
            const instance = new EntityStore(someName)
            instance['entity'] = {_id: '2'}
            expect(instance.isMyEntity(instance.entity)).toBe(true)
            expect(instance.isMyEntity({_id: '2'})).toBe(true)
        })
        test('isMyEntity returns false if it ids do not match.', async () => {
            const instance = new EntityStore(someName)
            instance['entity'] = {_id: '2'}
            expect(instance.isMyEntity({_id: '3'})).toBe(false)
        })
    })

    describe('onUpdated(entity)', () => {
        test('onUpdated called with entity with wrong _id', async () => {
            const instance = new EntityStore(someName)

            const stub = jest.fn()
            instance['reset'] = stub
            instance['entity'] = someEntity
            const anotherEntityModified = {_id: someId + '1', value: someValue + '1'}
            instance['onUpdated'](anotherEntityModified)
            expect(stub.mock.calls.length).toBe(0)
            expect(instance['entity']).toEqual(someEntity)
        })
        test('onUpdated ', async () => {
            const instance = new EntityStore(someName)
            instance['logger'] = someLogger
            instance['reset'] = jest.fn()
            instance['entity'] = someEntity
            const someEntityModified = {_id: someId, value: someValue + '1'}
            instance['onUpdated'](someEntityModified)
            expect(instance['reset']).toBeCalled()
            expect(instance['entity']).toEqual(someEntityModified)
        })

        test('onUpdated replaces the whole object', async () => {
            const instance = new EntityStore(someName)
            instance['logger'] = someLogger
            instance['reset'] = jest.fn()
            instance['entity'] = {...someEntity, anotherField: 'other'}
            const someEntityModified = {_id: someId, value: someValue + '1'}
            instance['onUpdated'](someEntityModified)
            expect(instance['reset']).toBeCalled()
            expect(instance['entity']).toEqual(someEntityModified)
        })
    })

    describe('onPatched(entity)', () => {
        test('onPatched called with entity with wrong _id', async () => {
            const instance = new EntityStore(someName)
            instance['logger'] = someLogger
            const stub = jest.fn()
            instance['reset'] = stub
            instance['entity'] = someEntity
            const anotherEntityModified = {_id: someId + '1', value: someValue + '1'}
            instance['onPatched'](anotherEntityModified)
            expect(stub.mock.calls.length).toBe(0)
            expect(instance['entity']).toEqual(someEntity)
        })

        test('onPatched partially updates an object', async () => {
            const instance = new EntityStore(someName)
            instance['logger'] = someLogger
            instance['reset'] = jest.fn()
            instance['entity'] = {...someEntity, anotherField: 'other'}
            const someEntityModified = {_id: someId, value: someValue + '1'}
            const extendedEntityModified = {...someEntityModified, anotherField: 'other'}

            instance['onPatched'](someEntityModified)
            expect(instance['reset']).toBeCalled()
            expect(instance['entity']).toEqual(extendedEntityModified)
        })
    })

    describe('onRemoved(entity)', () => {
        test('onRemoved called to remove a different entity', async () => {
            const instance = new EntityStore(someName)
            instance['logger'] = someLogger
            const stub = jest.fn()
            instance['reset'] = stub
            instance['entity'] = someEntity
            const anotherEntityModified = {_id: someId + '1', value: someValue + '1'}
            instance['onRemoved'](anotherEntityModified)
            expect(stub.mock.calls.length).toBe(0)
            expect(instance['entity']).toEqual(someEntity)
        })
        test('onRemoved called to remove the given entity', async () => {
            const instance = new EntityStore(someName)
            instance['logger'] = someLogger
            const stub = jest.fn()
            instance['reset'] = stub
            instance['entity'] = someEntity
            instance['onRemoved'](someEntity)
            expect(stub).toBeCalled()
            expect(instance['entity'].removed).toBeTruthy()
        })
    })

    describe('reset()', () => {
        test('reset calls super.reset and sets this.pending', async () => {
            const resetStub = jest.fn()
            BaseServiceStore.prototype.reset = resetStub
            const instance = new EntityStore(someName)
            instance['logger'] = someLogger
            instance['pending'] = someEntity
            instance.reset()
            expect(resetStub).toHaveBeenCalled()
            expect(instance.pending).toEqual({})
        })
    })

    describe('get(id:string)', () => {
        test('get by id with invalid id', async () => {
            const instance = new EntityStore(someName)
            await expect(async () => {
                await instance.get(null)
            }).rejects.toThrow('id is required to get entity')
        })
        test('get by id with valid id and entity that exists', async () => {
            const stub = {
                get: (id) => {
                    return id
                }
            }
            jest.spyOn(stub, 'get')

            const instance = new EntityStore(someName)
            instance['service'] = stub as unknown as ServiceMethods<never>

            instance.setError(someField, someMessage)
            await instance.get({_id: '1'})
            expect(stub.get).toHaveBeenCalledTimes(1)
            expect(instance.errors).toEqual({})
        })
        test('get by id with valid id and entity that does not exist', async () => {
            const stub = {
                get: async () => {
                    throw new Error(someErrorMessage)
                }
            }
            jest.spyOn(stub, 'get')

            const instance = new EntityStore(someName)
            instance['service'] = stub as unknown as ServiceMethods<never>
            instance['logger'] = someLogger
            instance['logger'].error = (ex) => {
                expect(ex.message).toEqual(someErrorMessage)
            }

            instance.setError(someField, someMessage)
            await instance.get({_id: '1'})

            expect(stub.get).toHaveBeenCalledTimes(1)
            expect((instance.errors as StoreErrors).message).toEqual(someErrorMessage)
            expect(instance.busy).toBe(false)
        })
    })
    describe('save()', () => {
        const serviceStub = {
            create: async () => { return },
            update: async () => { return },
        } as unknown as ServiceMethods<unknown>
        jest.spyOn(serviceStub, 'create')
        jest.spyOn(serviceStub, 'update')
        const validateStub = jest.fn()
        const instance = new EntityStore(someName)
        instance['service'] = serviceStub
        instance['createValidate'] = validateStub
        instance['logger'] = someLogger
        instance['errors'] = {} as StoreErrors
        instance['failed'] = jest.fn().mockImplementation(() => false)
        instance['reset'] = jest.fn().mockImplementation(() => {return})

        test('save when the entity is new', async () => {
            instance.entity = { _id: null } // make save call create.
            jest.spyOn(instance, 'create')
            jest.spyOn(instance, 'patch')
            await instance.save()
            expect(instance.create).toHaveBeenCalled()
            expect(instance.patch).not.toHaveBeenCalled()
        })
        test('save when the entity exists', async () => {
            instance.entity = { _id: someId } // make save call create.
            jest.spyOn(instance, 'create')
            jest.spyOn(instance, 'patch')
            await instance.save()
            expect(instance.patch).toHaveBeenCalled()
            expect(instance.create).not.toHaveBeenCalled()
        })
    })

    describe('create()', () => {
        const serviceStub = {
            create: async () => { return },
        } as unknown as ServiceMethods<unknown>
        jest.spyOn(serviceStub, 'create')
        const validateStub = jest.fn()
        const instance = new EntityStore(someName)
        instance['service'] = serviceStub
        instance['createValidate'] = validateStub
        instance['logger'] = someLogger

        test('create when entity is not new', async () => {
            instance.entity = { _id: someValue }
            await expect(async () => {
                await instance.create()
            }).rejects.toThrow('Create cannot be called once an entity has been retrieved')
        })
        test('create when the entity is new but invalid', async () => {
            instance.entity = { _id: null }
            const validateStub = jest.fn().mockImplementation(() => {
                instance['errors'] = someStoreError as any
            })
            instance['createValidate'] = validateStub
            await instance.create()
            expect(validateStub).toHaveBeenCalled()
            expect(instance['errors']).toBe(someStoreError)
        })
        test('create when the entity is new and valid', async () => {
            instance.entity = { _id: null }
            instance['errors'] = someStoreError as any
            const validateStub = jest.fn().mockImplementation(() => {
                instance.reset()
                instance['errors'] = {} as any
            })
            instance['createValidate'] = validateStub
            instance['reset'] = jest.fn().mockImplementation(() => {return})

            await instance.create()
            expect(validateStub).toHaveBeenCalled()
            expect(serviceStub.create).toHaveBeenCalled()
            expect(instance['reset']).toHaveBeenCalled()
            expect(instance['errors']).toEqual({})
        })
        test('create entity fails, throws and catches an error and sets the errors object', async () => {
            instance.entity = { _id: null }
            instance['errors'] = someStoreError as any
            const validateStub = jest.fn().mockImplementation(() => {
                instance['errors'] = {} as any
            })
            instance['createValidate'] = validateStub
            instance['reset'] = jest.fn().mockImplementation(() => {return})
            const serviceStubFail = {
                create: async () => { throw new Error(someErrorMessage) },
            } as unknown as ServiceMethods<unknown>
            jest.spyOn(serviceStubFail, 'create')

            instance['service'] = serviceStubFail
            await instance.create()

            expect(validateStub).toHaveBeenCalled()
            expect(serviceStubFail.create).toHaveBeenCalled()
            expect(instance['reset']).not.toHaveBeenCalled()
            expect(instance['errors'].message).toBe(someErrorMessage)
        })
    })

    describe('update()', () => {
        const serviceStub = {
            update: async () => { return },
        } as unknown as ServiceMethods<unknown>
        jest.spyOn(serviceStub, 'update')
        const instance = new EntityStore(someName)
        instance['service'] = serviceStub
        instance['logger'] = someLogger

        test('update no id is available', async () => {
            instance.entity = { _id: null }
            await expect(async () => {
                await instance.update()
            }).rejects.toThrow('id is required to update entity')
        })
        test('update entity doesn\'t exists throws', async () => {
            instance.entity = null
            await expect(async () => {
                await instance.update()
            }).rejects.toThrow('entity is required to update entity')
        })
        test('update fails validation of the object', async () => {
            instance.entity = { _id: someId }
            instance['errors'] = {} as any
            const validateStub = jest.fn().mockImplementation(() => {
                instance['errors'] = someStoreError as any
            })
            instance['updateValidate'] = validateStub
            await instance.update()
            expect(validateStub).toHaveBeenCalled()
            expect(instance['errors']).toBe(someStoreError)
        })
        test('update succeeds in updating an object', async () => {
            instance.entity = { _id: someId }
            instance['errors'] = someStoreError as any
            const validateStub = jest.fn().mockImplementation(() => {
                instance.reset()
                instance['errors'] = {} as any
            })
            instance['updateValidate'] = validateStub
            instance['reset'] = jest.fn().mockImplementation(() => {return})

            await instance.update()
            expect(validateStub).toHaveBeenCalled()
            expect(serviceStub.update).toHaveBeenCalled()
            expect(instance['reset']).toHaveBeenCalled()
            expect(instance['errors']).toEqual({})
        })
        test('update entity fails, throws and catches an error and sets the errors object', async () => {
            instance.entity = { _id: someId }
            instance['errors'] = someStoreError as any
            const validateStub = jest.fn().mockImplementation(() => {
                instance['errors'] = {} as any
            })
            instance['updateValidate'] = validateStub
            instance['reset'] = jest.fn().mockImplementation(() => {return})
            const serviceStubFail = {
                update: async () => { throw new Error(someErrorMessage) },
            } as unknown as ServiceMethods<unknown>
            jest.spyOn(serviceStubFail, 'update')

            instance['service'] = serviceStubFail
            await instance.update()

            expect(validateStub).toHaveBeenCalled()
            expect(serviceStubFail.update).toHaveBeenCalled()
            expect(instance['reset']).not.toHaveBeenCalled()
            expect(instance['errors'].message).toBe(someErrorMessage)
        })
    })

    describe('patch()', () => {
        const serviceStub = {
            patch: async () => { return },
        } as unknown as ServiceMethods<unknown>
        jest.spyOn(serviceStub, 'patch')
        const instance = new EntityStore(someName)
        instance['service'] = serviceStub
        instance['logger'] = someLogger

        test('patch no id is available', async () => {
            instance.entity = { _id: null }
            await expect(async () => {
                await instance.patch()
            }).rejects.toThrow('id is required to patch entity')
        })
        test('patch entity doesn\'t exists throws', async () => {
            instance.entity = null
            await expect(async () => {
                await instance.patch()
            }).rejects.toThrow('entity is required to patch an entity')
        })
        test('patch called with no pending patches', async () => {
            instance.entity = { _id: someId }
            instance['pending'] = {}
            const validateStub = jest.fn()
            instance['patchValidate'] = validateStub
            await instance.patch()
            expect(validateStub).not.toHaveBeenCalled()
            expect(instance['errors']).toEqual({ pending: { message: 'No changes were made'} })
        })
        test('patch fails validation of the object', async () => {
            instance.entity = { _id: someId }
            instance['failed'] = jest.fn().mockImplementation(() => true)
            instance['pending'] = someObject
            instance['errors'] = {} as any
            const validateStub = jest.fn().mockImplementation(() => {
                instance['errors'] = someStoreError as any
            })
            instance['patchValidate'] = validateStub

            await instance.patch()
            expect(validateStub).toHaveBeenCalled()
            expect(instance['errors']).toBe(someStoreError)
        })
        test('patch succeeds in patching an object', async () => {
            instance.entity = { _id: someId }
            instance['failed'] = jest.fn().mockImplementation(() => false)
            instance['reset'] = jest.fn().mockImplementation(() => {return})
            instance['pending'] = someObject
            instance['errors'] = someStoreError as any
            const validateStub = jest.fn().mockImplementation(() => {
                instance.reset()
                instance['errors'] = {} as any
            })
            instance['patchValidate'] = validateStub

            await instance.patch()
            expect(validateStub).toHaveBeenCalled()
            expect(serviceStub.patch).toHaveBeenCalled()
            expect(instance['reset']).toHaveBeenCalled()
            expect(instance['errors']).toEqual({})
        })
        test('patch entity fails, does not throw an error and sets the errors object', async () => {
            instance.entity = { _id: someId }
            instance['failed'] = jest.fn().mockImplementation(() => false)
            instance['reset'] = jest.fn().mockImplementation(() => {return})
            const serviceStubFail = {
                patch: async () => { throw new Error(someErrorMessage) },
            } as unknown as ServiceMethods<unknown>
            jest.spyOn(serviceStubFail, 'patch')
            instance['errors'] = someStoreError as any
            const validateStub = jest.fn().mockImplementation(() => {
                instance['errors'] = {} as any
            })
            instance['patchValidate'] = validateStub

            instance['service'] = serviceStubFail
            await instance.patch()

            expect(validateStub).toHaveBeenCalled()
            expect(serviceStubFail.patch).toHaveBeenCalled()
            expect(instance['reset']).not.toHaveBeenCalled()
            expect(instance['errors'].message).toBe(someErrorMessage)
        })
    })

    describe('remove()', () => {
        const serviceStub = {
            remove: async () => {
                return
            },
        } as unknown as ServiceMethods<unknown>
        jest.spyOn(serviceStub, 'remove')
        const instance = new EntityStore(someName)
        instance['service'] = serviceStub
        instance['logger'] = someLogger

        test('remove no id is available', async () => {
            instance.entity = {_id: null}
            await expect(async () => {
                await instance.remove()
            }).rejects.toThrow('id is required to remove entity')
        })
        test('remove succeeds in removing an object', async () => {
            instance.entity = { _id: someId }
            instance['errors'] = {} as any
            instance['failed'] = jest.fn().mockImplementation(() => false)
            instance['reset'] = jest.fn().mockImplementation(() => {return})
            instance['pending'] = someObject

            await instance.remove()
            expect(serviceStub.remove).toHaveBeenCalled()
            expect(instance['errors']).toEqual({})
        })
        test('remove entity fails, does not throw an error and sets the errors object', async () => {
            instance.entity = { _id: someId }
            instance['errors'] = {} as any
            instance['failed'] = jest.fn().mockImplementation(() => false)
            instance['reset'] = jest.fn().mockImplementation(() => {return})
            const serviceStubFail = {
                remove: async () => { throw new Error(someErrorMessage) },
            } as unknown as ServiceMethods<unknown>
            jest.spyOn(serviceStubFail, 'remove')

            instance['service'] = serviceStubFail
            await instance.remove()

            expect(serviceStubFail.remove).toHaveBeenCalled()
            expect(instance['errors'].message).toBe(someErrorMessage)
        })
    })

    describe('mapAjvErrors()', () => {
        test('returns null if there are no errors', async () => {
            const instance = new EntityStore(someName)
            instance.entity = {_id: someValue}
            jest.spyOn(instance, 'setError')
            const result1 = instance['mapAjvErrors']({})
            expect(result1).toBeFalsy()
            const result2 = instance['mapAjvErrors'](undefined)
            expect(result2).toBeFalsy()
            const result3 = instance['mapAjvErrors'](null)
            expect(result3).toBeFalsy()
        })
        test('sets the error array with the Ajv errors', async () => {
            // jest.restoreAllMocks()
            const instance = new EntityStore(someName)
            instance.entity = {_id: someValue}
            const errors = {
                'someField': {
                    'message': 'error'
                },
                'someField1': {
                    'message': 'error1'
                }
            }
            instance.setError = (field, message) => {
                instance.errors = Object.assign({}, instance.errors, {
                    [field]: {message}
                })
                return
            }

            jest.spyOn(instance, 'setError')
            const result1 = instance['mapAjvErrors']([
                {message: someErrorMessage, dataPath: [someMessage, someField,]},
                {message: someErrorMessage + '1', dataPath: [someMessage + '1', someField + '1',]}
            ])
            expect(result1).toEqual(errors)
            expect(instance.errors).toEqual(errors)
        })
    })

    describe('createValidate()', () => {
        test('calls reset and mapAjvErrors when validator exists and not pending', async () => {
            const instance = new EntityStore(someName)
            const resetStub = jest.fn()
            const validatorStub = jest.fn().mockImplementation(() => {
                return false
            })
            const ajvStub = jest.fn()

            BaseServiceStore.prototype.reset = resetStub
            instance['createValidator'] = validatorStub
            instance['mapAjvErrors'] = ajvStub
            instance['createValidate']()
            expect(resetStub).toBeCalled()
            expect(validatorStub).toBeCalled()
            expect(ajvStub).toBeCalled()
        })
        test('calls reset and does not call mapAjvErrors when validator does not exist', async () => {
            const instance = new EntityStore(someName)
            const resetStub = jest.fn()

            const ajvStub = jest.fn()

            BaseServiceStore.prototype.reset = resetStub
            instance['createValidator'] = null
            instance['mapAjvErrors'] = ajvStub
            instance['createValidate']()
            expect(resetStub).toBeCalled()
            expect(ajvStub).not.toBeCalled()
        })
        test('calls reset and does not callmapAjvErrors when validator exists but it is pending', async () => {
            const instance = new EntityStore(someName)
            const resetStub = jest.fn()
            const validatorStub = jest.fn().mockImplementation(() => {
                return true
            })
            const ajvStub = jest.fn()

            BaseServiceStore.prototype.reset = resetStub
            instance['createValidator'] = validatorStub
            instance['mapAjvErrors'] = ajvStub
            instance['createValidate']()
            expect(resetStub).toBeCalled()
            expect(validatorStub).toBeCalled()
            expect(ajvStub).not.toBeCalled()
        })
    })

    describe('patchValidate()', () => {
        test('calls reset and mapAjvErrors when validator exists and not pending', async () => {
            const instance = new EntityStore(someName)
            const resetStub = jest.fn()
            const validatorStub = jest.fn().mockImplementation(() => {
                return false
            })
            const ajvStub = jest.fn()

            BaseServiceStore.prototype.reset = resetStub
            instance['patchValidator'] = validatorStub
            instance['mapAjvErrors'] = ajvStub
            instance['patchValidate']()
            expect(resetStub).toBeCalled()
            expect(validatorStub).toBeCalled()
            expect(ajvStub).toBeCalled()
        })
        test('calls reset and does not call mapAjvErrors when validator does not exist', async () => {
            const instance = new EntityStore(someName)
            const resetStub = jest.fn()

            const ajvStub = jest.fn()

            BaseServiceStore.prototype.reset = resetStub
            instance['patchValidator'] = null
            instance['mapAjvErrors'] = ajvStub
            instance['patchValidate']()
            expect(resetStub).toBeCalled()
            expect(ajvStub).not.toBeCalled()
        })
        test('calls reset and does not callmapAjvErrors when validator exists but it is pending', async () => {
            const instance = new EntityStore(someName)
            const resetStub = jest.fn()
            const validatorStub = jest.fn().mockImplementation(() => {
                return true
            })
            const ajvStub = jest.fn()

            BaseServiceStore.prototype.reset = resetStub
            instance['patchValidator'] = validatorStub
            instance['mapAjvErrors'] = ajvStub
            instance['patchValidate']()
            expect(resetStub).toBeCalled()
            expect(validatorStub).toBeCalled()
            expect(ajvStub).not.toBeCalled()
        })
    })

    describe('updateValidate()', () => {
        test('calls reset and mapAjvErrors when validator exists and not pending', async () => {
            const instance = new EntityStore(someName)
            const resetStub = jest.fn()
            const validatorStub = jest.fn().mockImplementation(() => {
                return false
            })
            const ajvStub = jest.fn()

            BaseServiceStore.prototype.reset = resetStub
            instance['updateValidator'] = validatorStub
            instance['mapAjvErrors'] = ajvStub
            instance['updateValidate']()
            expect(resetStub).toBeCalled()
            expect(validatorStub).toBeCalled()
            expect(ajvStub).toBeCalled()
        })
        test('calls reset and does not call mapAjvErrors when validator does not exist', async () => {
            const instance = new EntityStore(someName)
            const resetStub = jest.fn()

            const ajvStub = jest.fn()

            BaseServiceStore.prototype.reset = resetStub
            instance['updateValidator'] = null
            instance['mapAjvErrors'] = ajvStub
            instance['updateValidate']()
            expect(resetStub).toBeCalled()
            expect(ajvStub).not.toBeCalled()
        })
        test('calls reset and does not callmapAjvErrors when validator exists but it is pending', async () => {
            const instance = new EntityStore(someName)
            const resetStub = jest.fn()
            const validatorStub = jest.fn().mockImplementation(() => {
                return true
            })
            const ajvStub = jest.fn()

            BaseServiceStore.prototype.reset = resetStub
            instance['updateValidator'] = validatorStub
            instance['mapAjvErrors'] = ajvStub
            instance['updateValidate']()
            expect(resetStub).toBeCalled()
            expect(validatorStub).toBeCalled()
            expect(ajvStub).not.toBeCalled()
        })
    })

    describe('base behavioiur', () => {
        test('_preServiceRequest()', () => {
            const instance = new EntityStore(someName)
            instance['_preServiceRequest']()
            expect(instance.errors).toEqual({})
            expect(instance.serviceRequestSuccess).toBe(false)
        })

        test('_postServiceRequest()', () => {
            const instance = new EntityStore(someName)
            instance['_postServiceRequest']()
            expect(instance.errors).toEqual({})
            expect(instance.serviceRequestSuccess).toBe(true)
        })

        test('_postServiceRequest() -> _preServiceRequest()', () => {
            const instance = new EntityStore(someName)
            instance['_postServiceRequest']()
            expect(instance.errors).toEqual({})
            expect(instance.serviceRequestSuccess).toBe(true)
            instance['_preServiceRequest']()
            expect(instance.errors).toEqual({})
            expect(instance.serviceRequestSuccess).toBe(false)
        })

        test('_preServiceRequest() -> _postServiceRequest()', () => {
            const instance = new EntityStore(someName)
            instance['_preServiceRequest']()
            expect(instance.errors).toEqual({})
            expect(instance.serviceRequestSuccess).toBe(false)
            instance['_postServiceRequest']()
            expect(instance.errors).toEqual({})
            expect(instance.serviceRequestSuccess).toBe(true)
        })
    })
})
