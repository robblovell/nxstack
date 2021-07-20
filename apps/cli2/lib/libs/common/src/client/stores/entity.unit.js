"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const entity_1 = require("./entity");
const base_1 = require("./base");
jest.mock('mobx');
describe('EntityStore', () => {
    const someName = 'someName';
    const someId = 'someId';
    const someValue = 'someValue';
    const someEntity = { _id: someId, value: someValue };
    const someField = 'someField';
    const someMessage = 'some message';
    const someErrorMessage = 'error';
    const someStoreError = { someField: someErrorMessage };
    const someObject = { someField: someValue };
    const someLogger = {
        info: () => {
            return;
        },
        error: () => {
            return;
        }
    };
    beforeEach(() => {
        jest.clearAllMocks();
    });
    describe('set(id)', () => {
        test.todo('set id');
    });
    test('Entity Store Constructor', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const ParentOriginal = Object.getPrototypeOf(entity_1.EntityStore);
        const ParentMock = jest.fn();
        Object.setPrototypeOf(entity_1.EntityStore, ParentMock);
        new entity_1.EntityStore(someName);
        expect(ParentMock).toHaveBeenCalledTimes(1);
        expect(ParentMock).toHaveBeenCalledWith(someName);
        Object.setPrototypeOf(entity_1.EntityStore, ParentOriginal);
    }));
    describe('Init()', () => {
        test('Init calls super init and initializes the service methods.', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            const instance = new entity_1.EntityStore(someName);
            const initStub = jest.fn();
            base_1.BaseServiceStore.prototype.init = initStub;
            expect(instance['service']).toBeUndefined();
            const methods = { updated: 0, patched: 0, removed: 0 };
            const stub = {
                on: (method, func) => {
                    expect(typeof func).toEqual('function');
                    methods[method]++;
                }
            };
            jest.spyOn(stub, 'on');
            instance['service'] = stub;
            instance.init();
            expect(initStub).toHaveBeenCalled();
            expect(instance.feathersServiceFactory).toBe(undefined);
            expect(stub.on).toHaveBeenCalledTimes(3);
            expect(methods.updated).toBe(1);
            expect(methods.patched).toBe(1);
            expect(methods.removed).toBe(1);
        }));
    });
    describe('isMyEntity(entity)', () => {
        test('isMyEntity returns false if it is undefined.', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            const instance = new entity_1.EntityStore(someName);
            expect(instance.entity).toBeUndefined();
            expect(instance.isMyEntity(null)).toBe(false);
        }));
        test('isMyEntity returns true if it has a value or is the same exact entity.', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            const instance = new entity_1.EntityStore(someName);
            instance['entity'] = { _id: '2' };
            expect(instance.isMyEntity(instance.entity)).toBe(true);
            expect(instance.isMyEntity({ _id: '2' })).toBe(true);
        }));
        test('isMyEntity returns false if it ids do not match.', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            const instance = new entity_1.EntityStore(someName);
            instance['entity'] = { _id: '2' };
            expect(instance.isMyEntity({ _id: '3' })).toBe(false);
        }));
    });
    describe('onUpdated(entity)', () => {
        test('onUpdated called with entity with wrong _id', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            const instance = new entity_1.EntityStore(someName);
            const stub = jest.fn();
            instance['reset'] = stub;
            instance['entity'] = someEntity;
            const anotherEntityModified = { _id: someId + '1', value: someValue + '1' };
            instance['onUpdated'](anotherEntityModified);
            expect(stub.mock.calls.length).toBe(0);
            expect(instance['entity']).toEqual(someEntity);
        }));
        test('onUpdated ', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            const instance = new entity_1.EntityStore(someName);
            instance['logger'] = someLogger;
            instance['reset'] = jest.fn();
            instance['entity'] = someEntity;
            const someEntityModified = { _id: someId, value: someValue + '1' };
            instance['onUpdated'](someEntityModified);
            expect(instance['reset']).toBeCalled();
            expect(instance['entity']).toEqual(someEntityModified);
        }));
        test('onUpdated replaces the whole object', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            const instance = new entity_1.EntityStore(someName);
            instance['logger'] = someLogger;
            instance['reset'] = jest.fn();
            instance['entity'] = Object.assign(Object.assign({}, someEntity), { anotherField: 'other' });
            const someEntityModified = { _id: someId, value: someValue + '1' };
            instance['onUpdated'](someEntityModified);
            expect(instance['reset']).toBeCalled();
            expect(instance['entity']).toEqual(someEntityModified);
        }));
    });
    describe('onPatched(entity)', () => {
        test('onPatched called with entity with wrong _id', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            const instance = new entity_1.EntityStore(someName);
            instance['logger'] = someLogger;
            const stub = jest.fn();
            instance['reset'] = stub;
            instance['entity'] = someEntity;
            const anotherEntityModified = { _id: someId + '1', value: someValue + '1' };
            instance['onPatched'](anotherEntityModified);
            expect(stub.mock.calls.length).toBe(0);
            expect(instance['entity']).toEqual(someEntity);
        }));
        test('onPatched partially updates an object', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            const instance = new entity_1.EntityStore(someName);
            instance['logger'] = someLogger;
            instance['reset'] = jest.fn();
            instance['entity'] = Object.assign(Object.assign({}, someEntity), { anotherField: 'other' });
            const someEntityModified = { _id: someId, value: someValue + '1' };
            const extendedEntityModified = Object.assign(Object.assign({}, someEntityModified), { anotherField: 'other' });
            instance['onPatched'](someEntityModified);
            expect(instance['reset']).toBeCalled();
            expect(instance['entity']).toEqual(extendedEntityModified);
        }));
    });
    describe('onRemoved(entity)', () => {
        test('onRemoved called to remove a different entity', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            const instance = new entity_1.EntityStore(someName);
            instance['logger'] = someLogger;
            const stub = jest.fn();
            instance['reset'] = stub;
            instance['entity'] = someEntity;
            const anotherEntityModified = { _id: someId + '1', value: someValue + '1' };
            instance['onRemoved'](anotherEntityModified);
            expect(stub.mock.calls.length).toBe(0);
            expect(instance['entity']).toEqual(someEntity);
        }));
        test('onRemoved called to remove the given entity', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            const instance = new entity_1.EntityStore(someName);
            instance['logger'] = someLogger;
            const stub = jest.fn();
            instance['reset'] = stub;
            instance['entity'] = someEntity;
            instance['onRemoved'](someEntity);
            expect(stub).toBeCalled();
            expect(instance['entity'].removed).toBeTruthy();
        }));
    });
    describe('reset()', () => {
        test('reset calls super.reset and sets this.pending', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            const resetStub = jest.fn();
            base_1.BaseServiceStore.prototype.reset = resetStub;
            const instance = new entity_1.EntityStore(someName);
            instance['logger'] = someLogger;
            instance['pending'] = someEntity;
            instance.reset();
            expect(resetStub).toHaveBeenCalled();
            expect(instance.pending).toEqual({});
        }));
    });
    describe('get(id:string)', () => {
        test('get by id with invalid id', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            const instance = new entity_1.EntityStore(someName);
            yield expect(() => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                yield instance.get(null);
            })).rejects.toThrow('id is required to get entity');
        }));
        test('get by id with valid id and entity that exists', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            const stub = {
                get: (id) => {
                    return id;
                }
            };
            jest.spyOn(stub, 'get');
            const instance = new entity_1.EntityStore(someName);
            instance['service'] = stub;
            instance.setError(someField, someMessage);
            yield instance.get({ _id: '1' });
            expect(stub.get).toHaveBeenCalledTimes(1);
            expect(instance.errors).toEqual({});
        }));
        test('get by id with valid id and entity that does not exist', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            const stub = {
                get: () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                    throw new Error(someErrorMessage);
                })
            };
            jest.spyOn(stub, 'get');
            const instance = new entity_1.EntityStore(someName);
            instance['service'] = stub;
            instance['logger'] = someLogger;
            instance['logger'].error = (ex) => {
                expect(ex.message).toEqual(someErrorMessage);
            };
            instance.setError(someField, someMessage);
            yield instance.get({ _id: '1' });
            expect(stub.get).toHaveBeenCalledTimes(1);
            expect(instance.errors.message).toEqual(someErrorMessage);
            expect(instance.busy).toBe(false);
        }));
    });
    describe('save()', () => {
        const serviceStub = {
            create: () => tslib_1.__awaiter(void 0, void 0, void 0, function* () { return; }),
            update: () => tslib_1.__awaiter(void 0, void 0, void 0, function* () { return; }),
        };
        jest.spyOn(serviceStub, 'create');
        jest.spyOn(serviceStub, 'update');
        const validateStub = jest.fn();
        const instance = new entity_1.EntityStore(someName);
        instance['service'] = serviceStub;
        instance['createValidate'] = validateStub;
        instance['logger'] = someLogger;
        instance['errors'] = {};
        instance['failed'] = jest.fn().mockImplementation(() => false);
        instance['reset'] = jest.fn().mockImplementation(() => { return; });
        test('save when the entity is new', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            instance.entity = { _id: null };
            jest.spyOn(instance, 'create');
            jest.spyOn(instance, 'patch');
            yield instance.save();
            expect(instance.create).toHaveBeenCalled();
            expect(instance.patch).not.toHaveBeenCalled();
        }));
        test('save when the entity exists', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            instance.entity = { _id: someId };
            jest.spyOn(instance, 'create');
            jest.spyOn(instance, 'patch');
            yield instance.save();
            expect(instance.patch).toHaveBeenCalled();
            expect(instance.create).not.toHaveBeenCalled();
        }));
    });
    describe('create()', () => {
        const serviceStub = {
            create: () => tslib_1.__awaiter(void 0, void 0, void 0, function* () { return; }),
        };
        jest.spyOn(serviceStub, 'create');
        const validateStub = jest.fn();
        const instance = new entity_1.EntityStore(someName);
        instance['service'] = serviceStub;
        instance['createValidate'] = validateStub;
        instance['logger'] = someLogger;
        test('create when entity is not new', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            instance.entity = { _id: someValue };
            yield expect(() => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                yield instance.create();
            })).rejects.toThrow('Create cannot be called once an entity has been retrieved');
        }));
        test('create when the entity is new but invalid', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            instance.entity = { _id: null };
            const validateStub = jest.fn().mockImplementation(() => {
                instance['errors'] = someStoreError;
            });
            instance['createValidate'] = validateStub;
            yield instance.create();
            expect(validateStub).toHaveBeenCalled();
            expect(instance['errors']).toBe(someStoreError);
        }));
        test('create when the entity is new and valid', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            instance.entity = { _id: null };
            instance['errors'] = someStoreError;
            const validateStub = jest.fn().mockImplementation(() => {
                instance.reset();
                instance['errors'] = {};
            });
            instance['createValidate'] = validateStub;
            instance['reset'] = jest.fn().mockImplementation(() => { return; });
            yield instance.create();
            expect(validateStub).toHaveBeenCalled();
            expect(serviceStub.create).toHaveBeenCalled();
            expect(instance['reset']).toHaveBeenCalled();
            expect(instance['errors']).toEqual({});
        }));
        test('create entity fails, throws and catches an error and sets the errors object', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            instance.entity = { _id: null };
            instance['errors'] = someStoreError;
            const validateStub = jest.fn().mockImplementation(() => {
                instance['errors'] = {};
            });
            instance['createValidate'] = validateStub;
            instance['reset'] = jest.fn().mockImplementation(() => { return; });
            const serviceStubFail = {
                create: () => tslib_1.__awaiter(void 0, void 0, void 0, function* () { throw new Error(someErrorMessage); }),
            };
            jest.spyOn(serviceStubFail, 'create');
            instance['service'] = serviceStubFail;
            yield instance.create();
            expect(validateStub).toHaveBeenCalled();
            expect(serviceStubFail.create).toHaveBeenCalled();
            expect(instance['reset']).not.toHaveBeenCalled();
            expect(instance['errors'].message).toBe(someErrorMessage);
        }));
    });
    describe('update()', () => {
        const serviceStub = {
            update: () => tslib_1.__awaiter(void 0, void 0, void 0, function* () { return; }),
        };
        jest.spyOn(serviceStub, 'update');
        const instance = new entity_1.EntityStore(someName);
        instance['service'] = serviceStub;
        instance['logger'] = someLogger;
        test('update no id is available', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            instance.entity = { _id: null };
            yield expect(() => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                yield instance.update();
            })).rejects.toThrow('id is required to update entity');
        }));
        test('update entity doesn\'t exists throws', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            instance.entity = null;
            yield expect(() => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                yield instance.update();
            })).rejects.toThrow('entity is required to update entity');
        }));
        test('update fails validation of the object', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            instance.entity = { _id: someId };
            instance['errors'] = {};
            const validateStub = jest.fn().mockImplementation(() => {
                instance['errors'] = someStoreError;
            });
            instance['updateValidate'] = validateStub;
            yield instance.update();
            expect(validateStub).toHaveBeenCalled();
            expect(instance['errors']).toBe(someStoreError);
        }));
        test('update succeeds in updating an object', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            instance.entity = { _id: someId };
            instance['errors'] = someStoreError;
            const validateStub = jest.fn().mockImplementation(() => {
                instance.reset();
                instance['errors'] = {};
            });
            instance['updateValidate'] = validateStub;
            instance['reset'] = jest.fn().mockImplementation(() => { return; });
            yield instance.update();
            expect(validateStub).toHaveBeenCalled();
            expect(serviceStub.update).toHaveBeenCalled();
            expect(instance['reset']).toHaveBeenCalled();
            expect(instance['errors']).toEqual({});
        }));
        test('update entity fails, throws and catches an error and sets the errors object', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            instance.entity = { _id: someId };
            instance['errors'] = someStoreError;
            const validateStub = jest.fn().mockImplementation(() => {
                instance['errors'] = {};
            });
            instance['updateValidate'] = validateStub;
            instance['reset'] = jest.fn().mockImplementation(() => { return; });
            const serviceStubFail = {
                update: () => tslib_1.__awaiter(void 0, void 0, void 0, function* () { throw new Error(someErrorMessage); }),
            };
            jest.spyOn(serviceStubFail, 'update');
            instance['service'] = serviceStubFail;
            yield instance.update();
            expect(validateStub).toHaveBeenCalled();
            expect(serviceStubFail.update).toHaveBeenCalled();
            expect(instance['reset']).not.toHaveBeenCalled();
            expect(instance['errors'].message).toBe(someErrorMessage);
        }));
    });
    describe('patch()', () => {
        const serviceStub = {
            patch: () => tslib_1.__awaiter(void 0, void 0, void 0, function* () { return; }),
        };
        jest.spyOn(serviceStub, 'patch');
        const instance = new entity_1.EntityStore(someName);
        instance['service'] = serviceStub;
        instance['logger'] = someLogger;
        test('patch no id is available', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            instance.entity = { _id: null };
            yield expect(() => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                yield instance.patch();
            })).rejects.toThrow('id is required to patch entity');
        }));
        test('patch entity doesn\'t exists throws', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            instance.entity = null;
            yield expect(() => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                yield instance.patch();
            })).rejects.toThrow('entity is required to patch an entity');
        }));
        test('patch called with no pending patches', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            instance.entity = { _id: someId };
            instance['pending'] = {};
            const validateStub = jest.fn();
            instance['patchValidate'] = validateStub;
            yield instance.patch();
            expect(validateStub).not.toHaveBeenCalled();
            expect(instance['errors']).toEqual({ pending: { message: 'No changes were made' } });
        }));
        test('patch fails validation of the object', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            instance.entity = { _id: someId };
            instance['failed'] = jest.fn().mockImplementation(() => true);
            instance['pending'] = someObject;
            instance['errors'] = {};
            const validateStub = jest.fn().mockImplementation(() => {
                instance['errors'] = someStoreError;
            });
            instance['patchValidate'] = validateStub;
            yield instance.patch();
            expect(validateStub).toHaveBeenCalled();
            expect(instance['errors']).toBe(someStoreError);
        }));
        test('patch succeeds in patching an object', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            instance.entity = { _id: someId };
            instance['failed'] = jest.fn().mockImplementation(() => false);
            instance['reset'] = jest.fn().mockImplementation(() => { return; });
            instance['pending'] = someObject;
            instance['errors'] = someStoreError;
            const validateStub = jest.fn().mockImplementation(() => {
                instance.reset();
                instance['errors'] = {};
            });
            instance['patchValidate'] = validateStub;
            yield instance.patch();
            expect(validateStub).toHaveBeenCalled();
            expect(serviceStub.patch).toHaveBeenCalled();
            expect(instance['reset']).toHaveBeenCalled();
            expect(instance['errors']).toEqual({});
        }));
        test('patch entity fails, does not throw an error and sets the errors object', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            instance.entity = { _id: someId };
            instance['failed'] = jest.fn().mockImplementation(() => false);
            instance['reset'] = jest.fn().mockImplementation(() => { return; });
            const serviceStubFail = {
                patch: () => tslib_1.__awaiter(void 0, void 0, void 0, function* () { throw new Error(someErrorMessage); }),
            };
            jest.spyOn(serviceStubFail, 'patch');
            instance['errors'] = someStoreError;
            const validateStub = jest.fn().mockImplementation(() => {
                instance['errors'] = {};
            });
            instance['patchValidate'] = validateStub;
            instance['service'] = serviceStubFail;
            yield instance.patch();
            expect(validateStub).toHaveBeenCalled();
            expect(serviceStubFail.patch).toHaveBeenCalled();
            expect(instance['reset']).not.toHaveBeenCalled();
            expect(instance['errors'].message).toBe(someErrorMessage);
        }));
    });
    describe('remove()', () => {
        const serviceStub = {
            remove: () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                return;
            }),
        };
        jest.spyOn(serviceStub, 'remove');
        const instance = new entity_1.EntityStore(someName);
        instance['service'] = serviceStub;
        instance['logger'] = someLogger;
        test('remove no id is available', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            instance.entity = { _id: null };
            yield expect(() => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                yield instance.remove();
            })).rejects.toThrow('id is required to remove entity');
        }));
        test('remove succeeds in removing an object', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            instance.entity = { _id: someId };
            instance['errors'] = {};
            instance['failed'] = jest.fn().mockImplementation(() => false);
            instance['reset'] = jest.fn().mockImplementation(() => { return; });
            instance['pending'] = someObject;
            yield instance.remove();
            expect(serviceStub.remove).toHaveBeenCalled();
            expect(instance['errors']).toEqual({});
        }));
        test('remove entity fails, does not throw an error and sets the errors object', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            instance.entity = { _id: someId };
            instance['errors'] = {};
            instance['failed'] = jest.fn().mockImplementation(() => false);
            instance['reset'] = jest.fn().mockImplementation(() => { return; });
            const serviceStubFail = {
                remove: () => tslib_1.__awaiter(void 0, void 0, void 0, function* () { throw new Error(someErrorMessage); }),
            };
            jest.spyOn(serviceStubFail, 'remove');
            instance['service'] = serviceStubFail;
            yield instance.remove();
            expect(serviceStubFail.remove).toHaveBeenCalled();
            expect(instance['errors'].message).toBe(someErrorMessage);
        }));
    });
    describe('mapAjvErrors()', () => {
        test('returns null if there are no errors', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            const instance = new entity_1.EntityStore(someName);
            instance.entity = { _id: someValue };
            jest.spyOn(instance, 'setError');
            const result1 = instance['mapAjvErrors']({});
            expect(result1).toBeFalsy();
            const result2 = instance['mapAjvErrors'](undefined);
            expect(result2).toBeFalsy();
            const result3 = instance['mapAjvErrors'](null);
            expect(result3).toBeFalsy();
        }));
        test('sets the error array with the Ajv errors', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            const instance = new entity_1.EntityStore(someName);
            instance.entity = { _id: someValue };
            const errors = {
                'someField': {
                    'message': 'error'
                },
                'someField1': {
                    'message': 'error1'
                }
            };
            instance.setError = (field, message) => {
                instance.errors = Object.assign({}, instance.errors, {
                    [field]: { message }
                });
                return;
            };
            jest.spyOn(instance, 'setError');
            const result1 = instance['mapAjvErrors']([
                { message: someErrorMessage, dataPath: [someMessage, someField,] },
                { message: someErrorMessage + '1', dataPath: [someMessage + '1', someField + '1',] }
            ]);
            expect(result1).toEqual(errors);
            expect(instance.errors).toEqual(errors);
        }));
    });
    describe('createValidate()', () => {
        test('calls reset and mapAjvErrors when validator exists and not pending', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            const instance = new entity_1.EntityStore(someName);
            const resetStub = jest.fn();
            const validatorStub = jest.fn().mockImplementation(() => {
                return false;
            });
            const ajvStub = jest.fn();
            base_1.BaseServiceStore.prototype.reset = resetStub;
            instance['createValidator'] = validatorStub;
            instance['mapAjvErrors'] = ajvStub;
            instance['createValidate']();
            expect(resetStub).toBeCalled();
            expect(validatorStub).toBeCalled();
            expect(ajvStub).toBeCalled();
        }));
        test('calls reset and does not call mapAjvErrors when validator does not exist', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            const instance = new entity_1.EntityStore(someName);
            const resetStub = jest.fn();
            const ajvStub = jest.fn();
            base_1.BaseServiceStore.prototype.reset = resetStub;
            instance['createValidator'] = null;
            instance['mapAjvErrors'] = ajvStub;
            instance['createValidate']();
            expect(resetStub).toBeCalled();
            expect(ajvStub).not.toBeCalled();
        }));
        test('calls reset and does not callmapAjvErrors when validator exists but it is pending', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            const instance = new entity_1.EntityStore(someName);
            const resetStub = jest.fn();
            const validatorStub = jest.fn().mockImplementation(() => {
                return true;
            });
            const ajvStub = jest.fn();
            base_1.BaseServiceStore.prototype.reset = resetStub;
            instance['createValidator'] = validatorStub;
            instance['mapAjvErrors'] = ajvStub;
            instance['createValidate']();
            expect(resetStub).toBeCalled();
            expect(validatorStub).toBeCalled();
            expect(ajvStub).not.toBeCalled();
        }));
    });
    describe('patchValidate()', () => {
        test('calls reset and mapAjvErrors when validator exists and not pending', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            const instance = new entity_1.EntityStore(someName);
            const resetStub = jest.fn();
            const validatorStub = jest.fn().mockImplementation(() => {
                return false;
            });
            const ajvStub = jest.fn();
            base_1.BaseServiceStore.prototype.reset = resetStub;
            instance['patchValidator'] = validatorStub;
            instance['mapAjvErrors'] = ajvStub;
            instance['patchValidate']();
            expect(resetStub).toBeCalled();
            expect(validatorStub).toBeCalled();
            expect(ajvStub).toBeCalled();
        }));
        test('calls reset and does not call mapAjvErrors when validator does not exist', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            const instance = new entity_1.EntityStore(someName);
            const resetStub = jest.fn();
            const ajvStub = jest.fn();
            base_1.BaseServiceStore.prototype.reset = resetStub;
            instance['patchValidator'] = null;
            instance['mapAjvErrors'] = ajvStub;
            instance['patchValidate']();
            expect(resetStub).toBeCalled();
            expect(ajvStub).not.toBeCalled();
        }));
        test('calls reset and does not callmapAjvErrors when validator exists but it is pending', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            const instance = new entity_1.EntityStore(someName);
            const resetStub = jest.fn();
            const validatorStub = jest.fn().mockImplementation(() => {
                return true;
            });
            const ajvStub = jest.fn();
            base_1.BaseServiceStore.prototype.reset = resetStub;
            instance['patchValidator'] = validatorStub;
            instance['mapAjvErrors'] = ajvStub;
            instance['patchValidate']();
            expect(resetStub).toBeCalled();
            expect(validatorStub).toBeCalled();
            expect(ajvStub).not.toBeCalled();
        }));
    });
    describe('updateValidate()', () => {
        test('calls reset and mapAjvErrors when validator exists and not pending', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            const instance = new entity_1.EntityStore(someName);
            const resetStub = jest.fn();
            const validatorStub = jest.fn().mockImplementation(() => {
                return false;
            });
            const ajvStub = jest.fn();
            base_1.BaseServiceStore.prototype.reset = resetStub;
            instance['updateValidator'] = validatorStub;
            instance['mapAjvErrors'] = ajvStub;
            instance['updateValidate']();
            expect(resetStub).toBeCalled();
            expect(validatorStub).toBeCalled();
            expect(ajvStub).toBeCalled();
        }));
        test('calls reset and does not call mapAjvErrors when validator does not exist', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            const instance = new entity_1.EntityStore(someName);
            const resetStub = jest.fn();
            const ajvStub = jest.fn();
            base_1.BaseServiceStore.prototype.reset = resetStub;
            instance['updateValidator'] = null;
            instance['mapAjvErrors'] = ajvStub;
            instance['updateValidate']();
            expect(resetStub).toBeCalled();
            expect(ajvStub).not.toBeCalled();
        }));
        test('calls reset and does not callmapAjvErrors when validator exists but it is pending', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            const instance = new entity_1.EntityStore(someName);
            const resetStub = jest.fn();
            const validatorStub = jest.fn().mockImplementation(() => {
                return true;
            });
            const ajvStub = jest.fn();
            base_1.BaseServiceStore.prototype.reset = resetStub;
            instance['updateValidator'] = validatorStub;
            instance['mapAjvErrors'] = ajvStub;
            instance['updateValidate']();
            expect(resetStub).toBeCalled();
            expect(validatorStub).toBeCalled();
            expect(ajvStub).not.toBeCalled();
        }));
    });
    describe('base behavioiur', () => {
        test('_preServiceRequest()', () => {
            const instance = new entity_1.EntityStore(someName);
            instance['_preServiceRequest']();
            expect(instance.errors).toEqual({});
            expect(instance.serviceRequestSuccess).toBe(false);
        });
        test('_postServiceRequest()', () => {
            const instance = new entity_1.EntityStore(someName);
            instance['_postServiceRequest']();
            expect(instance.errors).toEqual({});
            expect(instance.serviceRequestSuccess).toBe(true);
        });
        test('_postServiceRequest() -> _preServiceRequest()', () => {
            const instance = new entity_1.EntityStore(someName);
            instance['_postServiceRequest']();
            expect(instance.errors).toEqual({});
            expect(instance.serviceRequestSuccess).toBe(true);
            instance['_preServiceRequest']();
            expect(instance.errors).toEqual({});
            expect(instance.serviceRequestSuccess).toBe(false);
        });
        test('_preServiceRequest() -> _postServiceRequest()', () => {
            const instance = new entity_1.EntityStore(someName);
            instance['_preServiceRequest']();
            expect(instance.errors).toEqual({});
            expect(instance.serviceRequestSuccess).toBe(false);
            instance['_postServiceRequest']();
            expect(instance.errors).toEqual({});
            expect(instance.serviceRequestSuccess).toBe(true);
        });
    });
});
//# sourceMappingURL=entity.unit.js.map