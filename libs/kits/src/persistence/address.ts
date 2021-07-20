export const concatenate = (a, o) => ({ ...a, ...o })

export class PersistenceAddress {
    /* Generator functions for object modification */
    static toAddress = (kind: string, name: string, namespace: string, apiVersion: string) => (
        {
            apiVersion: apiVersion,
            kind,
            metadata: {
                namespace,
                name,
            }
        }
    )

    static toPersisentVolumeAddress = (name: string) => (
        {
            apiVersion: 'v1',
            kind: 'PersistentVolume',
            metadata: {
                name
            }
        }
    )

    static toPersisentVolumeClaimAddress = (namespace: string, name: string) => (
        {
            apiVersion: 'v1',
            kind: 'PersistentVolumeClaim',
            metadata: {
                namespace,
                name,
            }
        }
    )

    static toAppAddress = (namespace: string, appId: string) => (
        {
            apiVersion: 'system.codezero.io/v1',
            kind: 'App',
            metadata: {
                namespace,
                name: appId,
            }
        }
    )

    static toDeploymentAddress = (namespace: string, appId: string) => (
        {
            apiVersion: 'apps/v1',
            kind: 'Deployment',
            metadata: {
                namespace,
                name: appId,
            }
        }
    )

    static toStorageClassAddress = (name: string) => (
        {
            apiVersion: 'storage.k8s.io/v1',
            kind: 'StorageClass',
            metadata: {
                name
            }
        }
    )

    static toVolumeSnapshotAddress = (namespace: string, name: string) => (
        {
            apiVersion: 'snapshot.storage.k8s.io/v1beta1',
            kind: 'VolumeSnapshot',
            metadata: {
                namespace,
                name
            }
        }
    )

    static toVolumeHeader = () => (
        {
            apiVersion: 'system.codezero.io/v1',
            kind: 'Volume',
        }
    )

    static toVolumeAddress = (name: string) => (
        concatenate(
            PersistenceAddress.toVolumeHeader(),
            {
                metadata: {
                    name
                }
            }
        )
    )

    static toVolumeClaimLabels = (persistentVolumeClaimNamespace: string,
                                  persistentVolumeClaimName: string) => (
        {
            'system.codezero.io/volume-claim-namespace': persistentVolumeClaimNamespace,
            'system.codezero.io/volume-claim-name': persistentVolumeClaimName,
        }
    )

    static toVolumeObjectLabels = (persistentVolumeClaimNamespace: string,
                                   persistentVolumeClaimName: string,
                                   persistentVolumeName: string) => (
        concatenate(PersistenceAddress.toVolumeClaimLabels(persistentVolumeClaimNamespace, persistentVolumeClaimName),
            {
                'system.codezero.io/volume-name': persistentVolumeName,
            }
        )
    )

    static toVolumeFromVolumeClaimAddress = (
        persistentVolumeClaimNamespace: string,
        persistentVolumeClaimName: string
    ) => (
        concatenate(
            PersistenceAddress.toVolumeHeader(),
            {
                metadata: {
                    label: PersistenceAddress.toVolumeClaimLabels(persistentVolumeClaimNamespace, persistentVolumeClaimName)
                }
            }
        )
    )

    static toVolumeWithVolumeObjectNamesAddress = (
        persistentVolumeClaimNamespace: string,
        persistentVolumeClaimName: string,
        persistentVolumeName: string) => (
        concatenate(
            PersistenceAddress.toVolumeHeader(),
            {
                metadata: {
                    name: persistentVolumeName,
                    label: PersistenceAddress.toVolumeObjectLabels(
                        persistentVolumeClaimNamespace,
                        persistentVolumeClaimName,
                        persistentVolumeName)
                }
            }
        )
    )
}
