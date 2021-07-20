"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const configMap_1 = require("./configMap");
describe('ConfigMapHelper', () => {
    const some_name = 'name';
    const some_namespace = 'namespace';
    const some_data = { data: 'data' };
    test('ConfigMapHelper.template(some_name, some_namespace, some_data)', () => {
        expect(configMap_1.ConfigMapHelper.template(some_namespace, some_name, some_data))
            .toEqual({
            apiVersion: 'v1',
            kind: 'ConfigMap',
            metadata: {
                name: some_name,
                namespace: some_namespace
            },
            data: some_data
        });
    });
    test('ConfigMapHelper.template(undefined, some_namespace, some_data)', () => {
        expect(configMap_1.ConfigMapHelper.template(some_namespace, undefined, some_data))
            .toEqual({
            apiVersion: 'v1',
            kind: 'ConfigMap',
            metadata: {
                namespace: some_namespace
            },
            data: some_data
        });
    });
    test('ConfigMapHelper.template(some_name, some_namespace, undefined)', () => {
        expect(configMap_1.ConfigMapHelper.template(some_namespace, some_name, undefined))
            .toEqual({
            apiVersion: 'v1',
            kind: 'ConfigMap',
            metadata: {
                name: some_name,
                namespace: some_namespace
            },
        });
    });
    test('ConfigMapHelper.template(undefined, some_namespace, undefined)', () => {
        expect(configMap_1.ConfigMapHelper.template(some_namespace, undefined, undefined))
            .toEqual({
            apiVersion: 'v1',
            kind: 'ConfigMap',
            metadata: {
                namespace: some_namespace
            },
        });
    });
});
//# sourceMappingURL=configMap.unit.js.map