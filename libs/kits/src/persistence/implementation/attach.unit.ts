import { attachMixin } from './attach'
import { Persistence } from '../helper'
import { AttachRequest } from '@provisioner/contracts'

jest.mock('@c6o/kubeclient')

describe('Attach Helper', () => {

    const some_name = 'name'
    const some_storage = '5G'
    const some_err = 'err'
    test('constructor()', () => {
        const AttachHelper = attachMixin(Persistence)
        const result = new AttachHelper()

        expect(result.cluster).toBeDefined()
    })

    test('async getPersistentVolumeClaimAndSetupAttach(request: AttachRequest): Promise<Array<any>>', async () => {
        const persistenceHelper: Persistence = new Persistence()

        const some_pvc = {
            spec: {
                volumeName: some_name,
                resources: {
                    requests: {
                        storage: some_storage
                    }
                }
            }
        }
        persistenceHelper['getPersistentVolumeClaim'] = jest.fn().mockResolvedValue(some_pvc)
        await expect(async () => await persistenceHelper['getPersistentVolumeClaimAndSetupAttach']({} as AttachRequest)).rejects.toThrow()
        const pvc_request: AttachRequest = {
            volumeClaimName: 'somename',
            volumeSnapshotName: 'string',
            namespace: 'namespace',
            mountPoint: '/config',
            appName: 'app',
        }
        const [pvc, request] = await persistenceHelper['getPersistentVolumeClaimAndSetupAttach'](pvc_request)
        expect(pvc).toEqual(some_pvc)
        expect(request.volumeName).toEqual(some_name)
        expect(request.volumeSize).toEqual(some_storage)
    })

    test.todo('async getVolumeSnapshotAndSetupAttach(request: AttachRequest): Promise<Array<any>>')

    test('async getPersistentVolumeAndSetupAttach(request: AttachRequest): Promise<AttachRequest>', async () => {
        const persistenceHelper: Persistence = new Persistence()

        const some_pv = {
            metadata: { name: some_name },
            spec: { capacity: { storage: some_storage } },
        }
        persistenceHelper['getPersistentVolume'] = jest.fn().mockResolvedValue(some_pv)
        await expect(async () =>
            await persistenceHelper['getPersistentVolumeClaimAndSetupAttach']({} as AttachRequest))
            .rejects.toThrow()
        const pv_request: AttachRequest = {
            volumeClaimName: 'somename',
            volumeSnapshotName: 'string',
            namespace: 'namespace',
            mountPoint: '/config',
            appName: 'app',
        }
        const request = await persistenceHelper['getPersistentVolumeAndSetupAttach'](pv_request)
        expect(request.volumeClaimName).toEqual(pv_request.appName + '-' + pv_request.mountPoint.substring(1))
        expect(request.volumeName).toEqual(some_name)
        expect(request.volumeSize).toEqual(some_storage)
    })

    test('async getAppAndSetupAttach(request: AttachRequest): Promise<Array<any>>', async () => {
        const persistenceHelper: Persistence = new Persistence()
        const some_app1 = {
            resource: { spec: { provisioner: { volumes: [] } } }
        }
        const attachRequest1: AttachRequest = {
            namespace: 'namespace',
            appName: 'appName',
        } as any
        const getMock1 = jest.fn().mockResolvedValue(some_app1)
        persistenceHelper['getApplication'] = getMock1

        await expect(async () =>
            await persistenceHelper['getAppAndSetupAttach'](attachRequest1))
            .rejects.toThrow('If the application has more than one volume, ' +
                'mount point or a volume claim name must be given when only an app is given.')

        expect(getMock1).toBeCalledWith(attachRequest1.namespace, attachRequest1.appName)
//
        const some_error = 'err'

        const some_pvc2 = {
            mountPath: 'path',
            name: 'name',
            size: '5Gi',
        }
        const some_app2 = {
            resource: { spec: { provisioner: { volumes: [some_pvc2] } } }
        }
        const getMock2 = jest.fn().mockResolvedValue(some_app2)
        persistenceHelper['getApplication'] = getMock2
        const getMock3 = jest.fn().mockResolvedValue(some_pvc2)
        persistenceHelper['getPersistentVolumeClaim'] = getMock3

        const [result_pvc, result_request] = await persistenceHelper['getAppAndSetupAttach'](attachRequest1)
        expect(getMock2).toBeCalledWith(attachRequest1.namespace, attachRequest1.appName)
        expect(getMock3).toBeCalledWith(attachRequest1.namespace, attachRequest1.volumeClaimName)
        expect(result_request).toEqual({
            "appName": "appName",
            "mountPoint": "path",
            "namespace": "namespace",
            "volumeClaimName": "name",
            "volumeSize": "5Gi"
        })
        expect(result_pvc).toEqual(some_pvc2)
//
        const some_pvc20 = {
            mountPath: '/path',
            name: 'name',
            size: '5Gi',
        }
        const some_app20 = {
            resource: { spec: { provisioner: { volumes: [some_pvc2, some_pvc20] } } }
        }
        const getMock20 = jest.fn().mockResolvedValue(some_app20)
        persistenceHelper['getApplication'] = getMock20
        const getMock30 = jest.fn().mockResolvedValue(some_pvc20)
        persistenceHelper['getPersistentVolumeClaim'] = getMock30
        const attachRequest2: AttachRequest = {
            namespace: 'namespace',
            appName: 'appName',
            mountPoint: '/path'
        } as any
        const [result_pvc20, result_request20] = await persistenceHelper['getAppAndSetupAttach'](attachRequest2)
        expect(getMock20).toBeCalledWith(attachRequest1.namespace, attachRequest1.appName)
        expect(getMock30).toBeCalledWith(attachRequest1.namespace, attachRequest1.volumeClaimName)
        expect(result_request20).toEqual({
            "appName": "appName",
            "mountPoint": "/path",
            "namespace": "namespace",
            "volumeClaimName": "name",
            "volumeSize": "5Gi"
        })
        expect(result_pvc20).toEqual(some_pvc20)
//
        const some_pvc1_error = {
            error: some_error,
        }
        const some_app3 = {
            resource: { spec: { provisioner: { volumes: [some_pvc2] } } }
        }
        const getMock4 = jest.fn().mockResolvedValue(some_app3)
        persistenceHelper['getApplication'] = getMock4
        const getMock5 = jest.fn().mockResolvedValue(some_pvc1_error)
        persistenceHelper['getPersistentVolumeClaim'] = getMock5

        const [result_pvc2, result_request2] = await persistenceHelper['getAppAndSetupAttach'](attachRequest1)

        expect(result_request2).toEqual({
            "appName": "appName",
            "mountPoint": "path",
            "namespace": "namespace",
            "volumeClaimName": "name",
            "volumeSize": "5Gi"
        })
        expect(result_pvc2).toEqual({"error": "err"})
        //
        const some_app4 = {
            resource: { spec: { provisioner: { volumes: [null] } } }
        }
        const getMock6 = jest.fn().mockResolvedValue(some_app4)
        persistenceHelper['getApplication'] = getMock6

        await expect(async () =>
            await persistenceHelper['getAppAndSetupAttach'](attachRequest1))
            .rejects.toThrow('If the application has more than one volume, a mount point or ' +
                'a volume claim name must be given when only an app is given.')

    })

    test('async validatePersistentVolumeClaim(persistentVolumeClaim, deployment)', async () => {
        const persistenceHelper: Persistence = new Persistence()

        const patchMock = jest.fn().mockResolvedValue({throwIfError: () => false,} as any as any)
        persistenceHelper['cluster'] = {
            patch: patchMock,
        } as any
        const some_reference1 = { name: 'name1', kind: 'App' }
        const some_reference2 = { name: 'name2', kind: 'App' }
        const some_reference3 = { name: 'name3', kind: 'App' }
        const some_reference4 = { name: 'name4', kind: 'Kind' }
        const some_deployment = { resource: {
            name: 'name2', kind: 'kind2',
            metadata: { ownerReferences: [some_reference4], },
        } }

        // already has a reference from another deployment
        const some_pvc = {
            metadata: { ownerReferences: [some_reference1], },
        }
        await expect(async () =>
            await persistenceHelper['validatePersistentVolumeClaim'](some_pvc, some_deployment.resource))
            .rejects.toThrow('No deployment found for this application, is it installed properly?')

        some_deployment.resource.metadata.ownerReferences = [some_reference3]
        await expect(async () =>
            await persistenceHelper['validatePersistentVolumeClaim'](some_pvc, some_deployment.resource))
            .rejects.toThrow('Existing persistent volume is owned by another deployment.')

        // already has the right owner reference
        some_pvc.metadata = { ownerReferences: [some_reference2], } as any
        some_deployment.resource.metadata = { ownerReferences: [some_reference2], } as any
        await persistenceHelper['validatePersistentVolumeClaim'](some_pvc, some_deployment.resource)
        expect(patchMock).not.toBeCalled()

        // no owner reference, add the new one.
        some_pvc.metadata = {} as any
        await persistenceHelper['validatePersistentVolumeClaim'](some_pvc, some_deployment.resource)
        expect(patchMock).toBeCalledWith(some_pvc, [
            {
                'op': 'add',
                'path': `/metadata/ownerReferences`,
                'value': some_deployment.resource.metadata.ownerReferences,
            }])
    })

    test('async addOwnerReferenceToVolumeClaim(persistentVolumeClaim, deployment)', async () => {
        const persistenceHelper: Persistence = new Persistence()

        const patchMock = jest.fn().mockResolvedValue({throwIfError: () => false,} as any)
        persistenceHelper['cluster'] = {
            patch: patchMock
        } as any
        const some_pvc = {}
        const some_deployment = { resource: {
            metadata: {
                ownerReferences: some_name,
            }
        } }
        await persistenceHelper['addOwnerReferenceToVolumeClaim'](some_pvc, some_deployment.resource)
        expect(patchMock).toBeCalledWith(some_pvc, [
            {
                'op': 'add',
                'path': `/metadata/ownerReferences`,
                'value': some_deployment.resource.metadata.ownerReferences,
            }])
        const errorPatchMock = jest.fn().mockResolvedValue({ error: true, throwIfError: () => {throw new Error(some_err)}})
        persistenceHelper['cluster'] = {
            patch: errorPatchMock,
        } as any
        await expect(
            async () => await persistenceHelper['addOwnerReferenceToVolumeClaim'](some_pvc, some_deployment.resource))
            .rejects.toThrow()
        expect(errorPatchMock).toBeCalled()
    })

    test('async setupAttach(request: AttachRequest): Promise<Array<any>>', async () => {
        const attachRequest1: AttachRequest = {
            volumeClaimName: 'volumeClaimName',
        } as any
        const attachRequest2: AttachRequest = {
            volumeName: 'volumeName',
        } as any
        const attachRequest3: AttachRequest = {
            volumeSnapshotName: 'volumeSnapshotName',
        } as any
        const attachRequest4: AttachRequest = {
            appName: 'appName',
        } as any
        const attachRequest5: AttachRequest = {} as any
        const claim1 = { claim: 1 }, claim2 = { claim: 2 }, claim3 = { claim: 3 }
        const request1 = { request: 1 }, request2 = { request: 2 }, request3 = { request: 3 }, request4 = { request: 4 }
        const persistenceHelper: Persistence = new Persistence()
        const getMock1 = jest.fn().mockResolvedValue([claim1, request1])
        persistenceHelper['getPersistentVolumeClaimAndSetupAttach'] = getMock1
        const getMock2 = jest.fn().mockResolvedValue(request4)
        persistenceHelper['getPersistentVolumeAndSetupAttach'] = getMock2
        const getMock3 = jest.fn().mockResolvedValue([claim2, request2])
        persistenceHelper['getVolumeSnapshotAndSetupAttach'] = getMock3
        const getMock4 = jest.fn().mockResolvedValue([claim3, , request3])
        persistenceHelper['getAppAndSetupAttach'] = getMock4

        const [persistentVolumeClaim, request] = await persistenceHelper['setupAttach'](attachRequest1)
        expect(getMock1).toBeCalledWith(attachRequest1)

            // TODO: other expectations
    })

    test('async attach(request: AttachRequest): Promise<Result>', async () => {
        const attachRequest: AttachRequest = {
            volumeType: 'volumeType',
            volumeName: 'volumeName',
            volumeClaimName: 'volumeClaimName',
            volumeSnapshotName: 'volumeSnapshotName',
            volumeSize: 'volumeSize',
            namespace: 'namespace',
            appName: 'appName',
            mountPoint: '/mount',
        }
        const some_pvc = {
            spec: {
                volumeName: some_name,
                resources: {
                    requests: {
                        storage: some_storage,
                    }
                }
            }
        }
        const some_deployment = { resource: {
            name: 'name2', kind: 'kind2',
            metadata: { ownerReferences: [], },
        } }

        const persistenceHelper: Persistence = new Persistence()
        persistenceHelper['setupAttach'] = jest.fn().mockResolvedValue([some_pvc, attachRequest])
        persistenceHelper['getDeployment'] = jest.fn().mockResolvedValue(some_deployment)
        persistenceHelper['createPersistentVolumeClaim'] = jest.fn()
        persistenceHelper['validatePersistentVolumeClaim'] = jest.fn()
        persistenceHelper['addPVCToDeploymentVolumes'] = jest.fn()
        persistenceHelper['addPVCToDeploymentVolumeMounts'] = jest.fn()

        await persistenceHelper.attach(attachRequest)
        expect(persistenceHelper['setupAttach']).toBeCalledWith(attachRequest)
        expect(persistenceHelper['getDeployment']).toBeCalledWith(attachRequest.namespace, attachRequest.appName)
        expect(persistenceHelper['createPersistentVolumeClaim']).not.toBeCalled()
        expect(persistenceHelper['validatePersistentVolumeClaim']).toBeCalledWith(some_pvc, some_deployment.resource)
        expect(persistenceHelper['addPVCToDeploymentVolumes']).toBeCalledWith(
            some_deployment.resource,
            attachRequest.volumeClaimName,
            attachRequest.mountPoint,
        )
        expect(persistenceHelper['addPVCToDeploymentVolumeMounts']).toBeCalledWith(
            some_deployment.resource,
            attachRequest.volumeClaimName,
            attachRequest.mountPoint,
        )

        jest.clearAllMocks()
        persistenceHelper['setupAttach'] = jest.fn().mockResolvedValue([null, attachRequest])
        await persistenceHelper.attach(attachRequest)
        expect(persistenceHelper['setupAttach']).toBeCalledWith(attachRequest)
        expect(persistenceHelper['getDeployment']).toBeCalledWith(attachRequest.namespace, attachRequest.appName)
        expect(persistenceHelper['createPersistentVolumeClaim']).toBeCalledWith(attachRequest, [some_deployment.resource])
        expect(persistenceHelper['validatePersistentVolumeClaim']).not.toBeCalled()

        expect(persistenceHelper['addPVCToDeploymentVolumes']).toBeCalledWith(
            some_deployment.resource,
            attachRequest.volumeClaimName,
            attachRequest.mountPoint,
        )
        expect(persistenceHelper['addPVCToDeploymentVolumeMounts']).toBeCalledWith(
            some_deployment.resource,
            attachRequest.volumeClaimName,
            attachRequest.mountPoint,
        )
    })

})