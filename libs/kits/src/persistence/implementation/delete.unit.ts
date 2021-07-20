import {deleteMixin} from './delete'
import {Persistence} from '../helper'
import {DeleteRequest} from "@provisioner/contracts"

jest.mock('@c6o/kubeclient')

describe('Delete Helper', () => {

    const some_name = 'name'
    const some_storage = '5G'
    test('constructor()', () => {
        const DeleteHelper = deleteMixin(Persistence)
        const result = new DeleteHelper()

        expect(result.cluster).toBeDefined()
    })

    test('async deleteImplementation(request: DeleteRequest): Promise<Result>', async () => {
        const persistenceHelper: Persistence = new Persistence()
        const some_pv = {
            metadata: { name: some_name },
            spec: { capacity: { storage: some_storage } },
        }
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

        const delete_request: DeleteRequest = {
            persistentVolumeName: 'somename',
        }
        const getMock1 = jest.fn().mockResolvedValue(some_pvc)
        persistenceHelper['getPersistentVolumeClaim'] = getMock1
        const getMock2 = jest.fn().mockResolvedValue({})
        persistenceHelper['getPersistentVolume'] = getMock2
        const setMock1 = jest.fn().mockResolvedValue({})
        persistenceHelper['setRetainPolicyToDelete'] = setMock1
        const getMock3 = jest.fn().mockResolvedValue({})
        persistenceHelper['getDeployment'] = getMock3
        const removeMock1 = jest.fn().mockResolvedValue({})
        persistenceHelper['removePVCFromDeployment'] = removeMock1
        const deleteMock1 = jest.fn().mockResolvedValue({})
        persistenceHelper['deletePVC'] = deleteMock1
        const removeMock2 = jest.fn().mockResolvedValue({})
        persistenceHelper['removePVCReferenceFromPV'] = removeMock2

        await persistenceHelper['deleteImplementation'](delete_request)
        // expect(getMock1).toBeCalled()
        expect(getMock2).toBeCalled()
        expect(setMock1).toBeCalled()
        // expect(getMock3).toBeCalled()
        // expect(removeMock1).toBeCalled()
        // expect(deleteMock1).toBeCalled()
        // expect(removeMock2).toBeCalled()
    })

    describe('setRetainPolicyToDelete', () => {
        const some_doc = {}
        const some_err = 'some_err'

        test('async setRetainPolicyToDelete(doc: Resource) fails', async () => {
            const persistenceHelper: Persistence = new Persistence()

            const patchFailMock = jest.fn().mockResolvedValue({ error: some_err, throwIfError: () => {throw new Error(some_err)}, })
            persistenceHelper['cluster'] = {
                patch: patchFailMock
            } as any

            await expect(async () =>
                await persistenceHelper['setRetainPolicyToDelete'](some_doc))
                .rejects.toThrow(some_err)
            expect(patchFailMock).toBeCalled()
        })

        test('async setRetainPolicyToDelete(doc: Resource) succeeds', async () => {
            const persistenceHelper: Persistence = new Persistence()
            const patchMock = jest.fn().mockResolvedValue({throwIfError: () => false,})
            persistenceHelper['cluster'] = {
                patch: patchMock
            } as any

            await persistenceHelper['setRetainPolicyToDelete'](some_doc)

            expect(patchMock).toBeCalledWith(some_doc, [
                {
                    'op': 'replace',
                    'path': '/spec/persistentVolumeReclaimPolicy',
                    'value': 'Delete',
                }
            ])
        })
    })
    test.todo('getPersistentVolumeClaimFromVolume')
})