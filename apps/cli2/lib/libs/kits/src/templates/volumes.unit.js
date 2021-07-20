"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const volumes_1 = require("./volumes");
describe('getServiceTemplate', () => {
    const some_app = {
        componentLabels: 'label'
    };
    const some_namespace = 'namespace';
    const some_volume = {
        name: 'string',
        size: 'size',
    };
    test('toVolumeMountEntry = (volumeClaimName, mountPoint)', () => {
        expect(volumes_1.generatePersistentVolumeClaim(some_app, some_volume, some_namespace))
            .toEqual({
            kind: 'PersistentVolumeClaim',
            apiVersion: 'v1',
            metadata: {
                name: some_volume.name.toLowerCase(),
                namespace: some_namespace,
                labels: some_app.componentLabels,
            },
            spec: {
                accessModes: [
                    'ReadWriteOnce'
                ],
                resources: {
                    requests: {
                        storage: some_volume.size
                    }
                }
            }
        });
    });
});
//# sourceMappingURL=volumes.unit.js.map