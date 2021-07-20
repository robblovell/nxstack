import {PersistenceGenerator} from "./generators"

describe('PersistenceGenerators', () => {
    const some_id = 'id'
    const some_mount = '/mount'
    const some_name = 'name'
    const some_name2 = 'name2'
    const some_name3 = 'name3'
    const some_namespace = 'namespace'
    const some_size = 5
    const some_capacity = 'G'
    
    test('toVolumeMountEntry = (volumeClaimName, mountPoint)', () => {
        expect(PersistenceGenerator.toVolumeMountEntry(some_name, some_mount))
            .toEqual({
                mountPath: some_mount,
                name: some_name,
            })
    })

    test('toVolumeEntry = (volumeClaimName) => ', () => {
        expect(PersistenceGenerator.toVolumeEntry(some_name))
            .toEqual({
                name: some_name,
                persistentVolumeClaim: {
                    claimName: some_name,
                }
            })
    })

    test('toExpandRequest = (newSize: number, capacityUnit) => ', () => {
        expect(PersistenceGenerator.toExpandEntry(some_size, some_capacity))
            .toEqual({
                spec: {
                    resources: {
                        requests: {
                            storage: `${some_size}${some_capacity}`
                        }
                    }
                }
            })
    })

    test('createVolumeTemplate', () => {
        expect(PersistenceGenerator.createVolumeTemplate(some_namespace, some_name, some_name2))
            .toEqual(
                {
                    apiVersion: 'system.codezero.io/v1',
                    kind: 'Volume',
                    metadata: {
                        name: some_name2,
                        label: {
                            'system.codezero.io/volume-claim-namespace': some_namespace,
                            'system.codezero.io/volume-claim-name': some_name,
                            'system.codezero.io/volume-name': some_name2,
                        }
                    },
                    spec: {},
                }
            )
    })

    test('createSnapshotTemplate', () => {
        expect(PersistenceGenerator.createSnapshotTemplate(some_namespace, some_name, some_name2, some_name3))
            .toEqual(
                {
                    apiVersion: 'snapshot.storage.k8s.io/v1beta1',
                    kind: 'VolumeSnapshot',
                    metadata: {
                        namespace: some_namespace,
                        name: some_name3,
                    },
                    spec: {
                        volumeSnapshotClassName: some_name2,
                        source: {
                            persistentVolumeClaimName: some_name
                        }
                    }
                }
            )
    })

})