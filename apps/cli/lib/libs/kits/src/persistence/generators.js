"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PersistenceGenerator = void 0;
const address_1 = require("./address");
class PersistenceGenerator {
}
exports.PersistenceGenerator = PersistenceGenerator;
PersistenceGenerator.toVolumeMountEntry = (volumeClaimName, mountPoint) => ({
    mountPath: mountPoint,
    name: volumeClaimName,
});
PersistenceGenerator.toVolumeEntry = (volumeClaimName) => ({
    name: volumeClaimName,
    persistentVolumeClaim: {
        claimName: volumeClaimName,
    }
});
PersistenceGenerator.toExpandEntry = (newSize, capacityUnit = 'Gi') => ({
    spec: {
        resources: {
            requests: {
                storage: `${newSize}${capacityUnit}`
            }
        }
    }
});
PersistenceGenerator.createVolumeTemplate = (namespace, persistentVolumeClaimName, persistentVolumeName) => (Object.assign(Object.assign({}, address_1.PersistenceAddress.toVolumeWithVolumeObjectNamesAddress(namespace, persistentVolumeClaimName, persistentVolumeName)), { spec: {} }));
PersistenceGenerator.createSnapshotTemplate = (namespace, persistentVolumeClaimName, volumeSnapshotClassName, snapshotName) => (Object.assign(Object.assign({}, address_1.PersistenceAddress.toVolumeSnapshotAddress(namespace, snapshotName)), { spec: {
        volumeSnapshotClassName,
        source: {
            persistentVolumeClaimName
        }
    } }));
//# sourceMappingURL=generators.js.map