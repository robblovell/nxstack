"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const services_1 = require("./services");
describe('getServiceTemplate', () => {
    const some_name = 'name';
    const some_namespace = 'namespace';
    const some_ports = {
        protocol: 'string',
        port: 1000,
        something: 'any',
    };
    test('toVolumeMountEntry = (volumeClaimName, mountPoint)', () => {
        expect(services_1.getServiceTemplate(some_name, some_namespace, [some_ports]))
            .toEqual({
            apiVersion: 'v1',
            kind: 'Service',
            metadata: {
                name: some_name,
                namespace: some_namespace
            },
            spec: {
                type: 'NodePort',
                ports: [some_ports],
                selector: { app: some_name }
            }
        });
    });
});
//# sourceMappingURL=services.unit.js.map