import {concatenate, PersistenceAddress} from './address'

describe('PersistenceAddresss', () => {
    const some_id = 'id'
    const some_mount = '/mount'
    const some_name = 'name'
    const some_name2 = 'name2'
    const some_name3 = 'name3'
    const some_namespace = 'namespace'
    const some_size = 5
    const some_capacity = 'G'

    test('toPersisentVolumeAddress = (name: string) => ', () => {
        expect(PersistenceAddress.toPersisentVolumeAddress(some_name))
            .toEqual({
                apiVersion: 'v1',
                kind: 'PersistentVolume',
                metadata: {
                    name: some_name
                }
            })
    })

    test('toPersisentVolumeClaimAddress = (namespace: string, name: string)', () => {
        expect(PersistenceAddress.toPersisentVolumeClaimAddress(some_namespace, some_name))
            .toEqual({
                apiVersion: 'v1',
                kind: 'PersistentVolumeClaim',
                // labels: {
                //     'system.codezero.io/app': appId
                // },
                metadata: {
                    namespace: some_namespace,
                    name: some_name,
                }
            })
    })

    test('toAppAddress = (namespace: string, appId: string)', () => {
        expect(PersistenceAddress.toAppAddress(some_namespace, some_id))
            .toEqual({
                apiVersion: 'system.codezero.io/v1',
                kind: 'App',
                metadata: {
                    namespace: some_namespace,
                    name: some_id,
                }
            })
    })

    test('toDeploymentAddress  = (namespace: string, appId: string)', () => {
        expect(PersistenceAddress.toDeploymentAddress(some_namespace, some_id))
            .toEqual({
                apiVersion: 'apps/v1',
                kind: 'Deployment',
                metadata: {
                    namespace: some_namespace,
                    name: some_id,
                }
            })
    })

    test('toStorageClassAddress = (name: string)', () => {
        expect(PersistenceAddress.toStorageClassAddress(some_name))
            .toEqual({
                apiVersion: 'storage.k8s.io/v1',
                kind: 'StorageClass',
                metadata: {
                    name: some_name
                }
            })
    })

    test('toVolumeSnapshotAddress = (namespace: string, name: string)', () => {
        expect(PersistenceAddress.toVolumeSnapshotAddress(some_namespace, some_name))
            .toEqual({
                apiVersion: 'snapshot.storage.k8s.io/v1beta1',
                kind: 'VolumeSnapshot',
                metadata: {
                    namespace: some_namespace,
                    name: some_name,
                }
            })
    })

    test('concatinate = (a, b)', () => {
        expect(concatenate({ a:'a', b: 'b' }, { c: 'c', d:'d' }))
            .toEqual({ a:'a', b: 'b', c: 'c', d:'d' })
    })

    test('toVolumeAddress = (name: string)', () => {
        expect(PersistenceAddress.toVolumeAddress(some_name))
            .toEqual({
                apiVersion: 'system.codezero.io/v1',
                kind: 'Volume',
                metadata: {
                    name: some_name
                }
            })
    })

    test('toVolumeFromVolumeClaimAddress = (namespace: string, name: string)', () => {
        expect(PersistenceAddress.toVolumeFromVolumeClaimAddress(some_namespace, some_name))
            .toEqual({
                apiVersion: 'system.codezero.io/v1',
                kind: 'Volume',
                metadata: {
                    label: {
                        'system.codezero.io/volume-claim-namespace': some_namespace,
                        'system.codezero.io/volume-claim-name': some_name,
                    }
                }
            })
    })

    test('toVolumeWithVolumeObjectNamesAddress = (namespace: string, name: string)', () => {
        expect(PersistenceAddress.toVolumeWithVolumeObjectNamesAddress(some_namespace, some_name, some_name2))
            .toEqual({
                apiVersion: 'system.codezero.io/v1',
                kind: 'Volume',
                metadata: {
                    label: {
                        'system.codezero.io/volume-claim-namespace': some_namespace,
                        'system.codezero.io/volume-claim-name': some_name,
                        'system.codezero.io/volume-name': some_name2,
                    },
                    name: some_name2,
                }
            })
    })
})