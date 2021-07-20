"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generatePersistentVolumeClaim = void 0;
function generatePersistentVolumeClaim(app, volume, namespace) {
    return {
        kind: 'PersistentVolumeClaim',
        apiVersion: 'v1',
        metadata: {
            name: volume.name.toLowerCase(),
            namespace: namespace,
            labels: app.componentLabels,
        },
        spec: {
            accessModes: [
                'ReadWriteOnce'
            ],
            resources: {
                requests: {
                    storage: volume.size
                }
            }
        }
    };
}
exports.generatePersistentVolumeClaim = generatePersistentVolumeClaim;
//# sourceMappingURL=volumes.js.map