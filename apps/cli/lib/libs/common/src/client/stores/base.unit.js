"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const base_1 = require("./base");
describe('BaseServiceStore Class', () => {
    const someName = 'some name';
    const someField = 'some field';
    const someMessage = 'some message';
    beforeEach(() => {
        jest.clearAllMocks();
    });
    test('BaseServiceStore constructor', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const instance = new base_1.BaseServiceStore(someName);
        expect(instance.serviceName).toBe(someName);
        expect(instance.errors).toEqual({});
        expect(instance.feathersServiceFactory).toBe(undefined);
        expect(instance.serviceName).toEqual(someName);
    }));
    describe('success and failed()', () => {
        test('BaseServiceStore success', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            const instance = new base_1.BaseServiceStore(someName);
            instance['errors'] = {};
            expect(instance.isValid).toBeTruthy();
        }));
        test('BaseServiceStore success fails', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            const instance = new base_1.BaseServiceStore(someName);
            instance['errors'] = { error: 'error' };
            expect(instance.isValid).toBeFalsy();
        }));
    });
    test('Init calls create service', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const instance = new base_1.BaseServiceStore(someName);
        const stub = jest.fn();
        instance.createService = stub;
        instance.init();
        expect(stub).toHaveBeenCalled();
        expect(instance.feathersServiceFactory).toBe(undefined);
    }));
    describe('createService()', () => {
        test('CreateService returns if the service is already created', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            const instance = new base_1.BaseServiceStore(someName);
            expect(instance.feathersServiceFactory).toBe(undefined);
            instance.serviceName = undefined;
            const result = instance.createService();
            expect(result).toBe(false);
        }));
        test('CreateService throws an error if the feather service factory is not available.', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            const instance = new base_1.BaseServiceStore(someName);
            expect(instance.feathersServiceFactory).toBe(undefined);
            expect(() => {
                instance.createService();
            }).toThrow('A Feathers service factory is required');
        }));
        test('CreateService calls createService using the feathers service factory.', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            const stub = {
                createService: (name) => {
                    return name;
                }
            };
            jest.spyOn(stub, 'createService');
            const instance = new base_1.BaseServiceStore(someName);
            instance.feathersServiceFactory = stub;
            const result = instance.createService();
            expect(result).toBe(true);
            expect(stub.createService).toHaveBeenCalledTimes(1);
        }));
    });
    test('reset sets errors to an empty structure.', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const instance = new base_1.BaseServiceStore(someName);
        instance.setError(someField, someMessage);
        expect(instance.errors[someField]).toEqual({ 'message': someMessage });
        instance.reset();
        expect(instance.errors).toEqual({});
    }));
    test('setError creates a new error and calls Object.assign with field:message passed in', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const instance = new base_1.BaseServiceStore(someName);
        instance.setError(someField, someMessage);
        expect(instance.errors[someField]).toEqual({ 'message': someMessage });
        instance.setError(someField + '1', someMessage + '1');
        expect(instance.errors[someField]).toEqual({ 'message': someMessage });
        expect(instance.errors[someField + '1']).toEqual({ 'message': someMessage + '1' });
    }));
    test('setError changes an existing error. ', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const instance = new base_1.BaseServiceStore(someName);
        instance.setError(someField, someMessage);
        instance.setError(someField + '1', someMessage + '1');
        instance.setError(someField, someMessage + '2');
        instance.setError(someField + '1', someMessage + '3');
        expect(instance.errors[someField]).toEqual({ 'message': someMessage + '2' });
        expect(instance.errors[someField + '1']).toEqual({ 'message': someMessage + '3' });
    }));
    test('ClearError deletes the specific error by the field name.', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const instance = new base_1.BaseServiceStore(someName);
        instance.setError(someField, someMessage);
        instance.setError(someField + '1', someMessage + '1');
        expect(instance.errors[someField]).toEqual({ 'message': someMessage });
        expect(instance.errors[someField + '1']).toEqual({ 'message': someMessage + '1' });
        instance.clearError(someField);
        expect(instance.errors[someField]).toBeUndefined();
        expect(instance.errors[someField + '1']).toEqual({ 'message': someMessage + '1' });
        instance.clearError(someField + '1');
        expect(instance.errors[someField + '1']).toBeUndefined();
    }));
});
//# sourceMappingURL=base.unit.js.map