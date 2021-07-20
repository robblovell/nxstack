"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PersistenceAddress = exports.concatenate = void 0;
const concatenate = (a, o) => (Object.assign(Object.assign({}, a), o));
exports.concatenate = concatenate;
class PersistenceAddress {
}
exports.PersistenceAddress = PersistenceAddress;
PersistenceAddress.toAddress = (kind, name, namespace, apiVersion) => ({
    apiVersion: apiVersion,
    kind,
    metadata: {
        namespace,
        name,
    }
});
PersistenceAddress.toPersisentVolumeAddress = (name) => ({
    apiVersion: 'v1',
    kind: 'PersistentVolume',
    metadata: {
        name
    }
});
PersistenceAddress.toPersisentVolumeClaimAddress = (namespace, name) => ({
    apiVersion: 'v1',
    kind: 'PersistentVolumeClaim',
    metadata: {
        namespace,
        name,
    }
});
PersistenceAddress.toAppAddress = (namespace, appId) => ({
    apiVersion: 'system.codezero.io/v1',
    kind: 'App',
    metadata: {
        namespace,
        name: appId,
    }
});
PersistenceAddress.toDeploymentAddress = (namespace, appId) => ({
    apiVersion: 'apps/v1',
    kind: 'Deployment',
    metadata: {
        namespace,
        name: appId,
    }
});
PersistenceAddress.toStorageClassAddress = (name) => ({
    apiVersion: 'storage.k8s.io/v1',
    kind: 'StorageClass',
    metadata: {
        name
    }
});
PersistenceAddress.toVolumeSnapshotAddress = (namespace, name) => ({
    apiVersion: 'snapshot.storage.k8s.io/v1beta1',
    kind: 'VolumeSnapshot',
    metadata: {
        namespace,
        name
    }
});
PersistenceAddress.toVolumeHeader = () => ({
    apiVersion: 'system.codezero.io/v1',
    kind: 'Volume',
});
PersistenceAddress.toVolumeAddress = (name) => (exports.concatenate(PersistenceAddress.toVolumeHeader(), {
    metadata: {
        name
    }
}));
PersistenceAddress.toVolumeClaimLabels = (persistentVolumeClaimNamespace, persistentVolumeClaimName) => ({
    'system.codezero.io/volume-claim-namespace': persistentVolumeClaimNamespace,
    'system.codezero.io/volume-claim-name': persistentVolumeClaimName,
});
PersistenceAddress.toVolumeObjectLabels = (persistentVolumeClaimNamespace, persistentVolumeClaimName, persistentVolumeName) => (exports.concatenate(PersistenceAddress.toVolumeClaimLabels(persistentVolumeClaimNamespace, persistentVolumeClaimName), {
    'system.codezero.io/volume-name': persistentVolumeName,
}));
PersistenceAddress.toVolumeFromVolumeClaimAddress = (persistentVolumeClaimNamespace, persistentVolumeClaimName) => (exports.concatenate(PersistenceAddress.toVolumeHeader(), {
    metadata: {
        label: PersistenceAddress.toVolumeClaimLabels(persistentVolumeClaimNamespace, persistentVolumeClaimName)
    }
}));
PersistenceAddress.toVolumeWithVolumeObjectNamesAddress = (persistentVolumeClaimNamespace, persistentVolumeClaimName, persistentVolumeName) => (exports.concatenate(PersistenceAddress.toVolumeHeader(), {
    metadata: {
        name: persistentVolumeName,
        label: PersistenceAddress.toVolumeObjectLabels(persistentVolumeClaimNamespace, persistentVolumeClaimName, persistentVolumeName)
    }
}));
//# sourceMappingURL=address.js.map