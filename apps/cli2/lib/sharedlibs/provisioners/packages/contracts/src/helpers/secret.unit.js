"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const secret_1 = require("./secret");
describe('SecretHelper', () => {
    const some_name = 'name';
    const some_namespace = 'namespace';
    const some_data = { data: 'data' };
    test('SecretHelper.template(some_namespace, some_name, some_data))', () => {
        expect(secret_1.SecretHelper.template(some_namespace, some_name, some_data))
            .toEqual({
            apiVersion: 'v1',
            kind: 'Secret',
            metadata: {
                name: `${some_name}`,
                namespace: some_namespace
            },
            data: some_data
        });
    });
    test('SecretHelper.template(some_namespace, undefined, some_data)', () => {
        expect(secret_1.SecretHelper.template(some_namespace, undefined, some_data))
            .toEqual({
            apiVersion: 'v1',
            kind: 'Secret',
            metadata: {
                namespace: some_namespace
            },
            data: some_data
        });
    });
    test('SecretHelper.template(some_namespace, some_name, undefined)', () => {
        expect(secret_1.SecretHelper.template(some_namespace, some_name, undefined))
            .toEqual({
            apiVersion: 'v1',
            kind: 'Secret',
            metadata: {
                name: `${some_name}`,
                namespace: some_namespace
            },
        });
    });
    test('SecretHelper.template(some_namespace, undefined, undefined)', () => {
        expect(secret_1.SecretHelper.template(some_namespace, undefined, undefined))
            .toEqual({
            apiVersion: 'v1',
            kind: 'Secret',
            metadata: {
                namespace: some_namespace
            },
        });
    });
});
//# sourceMappingURL=secret.unit.js.map