import { PersistenceAddress } from "./address"

export class PersistenceGenerator {
    /* Generator functions for object modification */
    // TODO: Some objects need to have the 'system.codezero.io' label inserted.
    // generation of sections of documents
    static toVolumeMountEntry = (volumeClaimName, mountPoint) => (
        {
            mountPath: mountPoint,
            name: volumeClaimName,
        }
    )

    static toVolumeEntry = (volumeClaimName) => (
        {
            name: volumeClaimName,
            persistentVolumeClaim: {
                claimName: volumeClaimName,
            }
        }
    )

    static toExpandEntry = (newSize: number, capacityUnit = 'Gi') => (
        {
            spec: {
                resources: {
                    requests: {
                        storage: `${newSize}${capacityUnit}`
                    }
                }
            }
        }
    )

    // full templates for creation
    static createVolumeTemplate = (namespace: string,
                                   persistentVolumeClaimName: string,
                                   persistentVolumeName: string) => (
        {
            ...PersistenceAddress.toVolumeWithVolumeObjectNamesAddress(namespace, persistentVolumeClaimName, persistentVolumeName),
            spec: {

            }
        }
    )

    static createSnapshotTemplate = (namespace: string,
                                 persistentVolumeClaimName: string,
                                 volumeSnapshotClassName: string,
                                 snapshotName: string) => (
        {
            ...PersistenceAddress.toVolumeSnapshotAddress(namespace, snapshotName),
            spec: {
                volumeSnapshotClassName,
                source: {
                    persistentVolumeClaimName
                }
            }
        }
    )
}
