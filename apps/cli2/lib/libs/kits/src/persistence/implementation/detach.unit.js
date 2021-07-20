"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const detach_1 = require("./detach");
const helper_1 = require("../helper");
jest.mock('@c6o/kubeclient');
describe('Detach Helper', () => {
    const some_name = 'name';
    const some_storage = '5G';
    const some_err = 'err';
    test('constructor()', () => {
        const DetachHelper = detach_1.detachMixin(helper_1.Persistence);
        const result = new DetachHelper();
        expect(result.cluster).toBeDefined();
        expect(result.getPersistentVolumeClaim).toBeDefined();
        expect(result.getPersistentVolume).toBeDefined();
        expect(result.setVolumeToRetain).toBeDefined();
        expect(result.getDeployment).toBeDefined();
        expect(result.removePVCFromDeployment).toBeDefined();
        expect(result.deletePVC).toBeDefined();
        expect(result.removePVCReferenceFromPV).toBeDefined();
        const persistenceHelper = new helper_1.Persistence();
        expect(persistenceHelper.cluster).toBeDefined();
        expect(persistenceHelper.setVolumeToRetain).toBeDefined();
        expect(persistenceHelper.removePVCFromDeployment).toBeDefined();
        expect(persistenceHelper.deletePVC).toBeDefined();
        expect(persistenceHelper.removePVCReferenceFromPV).toBeDefined();
    });
    test.skip('async detach(request: DetachRequest): Promise<Result>', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const detachRequest = {
            persistentVolumeClaimName: 'string',
            namespace: 'string',
            appName: 'string',
        };
        const some_pvc = {
            spec: {
                volumeName: some_name,
                resources: {
                    requests: {
                        storage: some_storage,
                    }
                }
            }
        };
        const some_pv = {
            metadata: { name: some_name },
            spec: { capacity: { storage: some_storage } },
        };
        const some_deployment = {
            name: 'name2', kind: 'kind2',
            metadata: { ownerReferences: [], },
        };
        const persistenceHelper = new helper_1.Persistence();
        persistenceHelper['getPersistentVolumeClaim'] = jest.fn().mockResolvedValue(some_pvc);
        persistenceHelper['getPersistentVolume'] = jest.fn().mockResolvedValue(some_pv);
        persistenceHelper['setVolumeToRetain'] = jest.fn();
        persistenceHelper['getDeployment'] = jest.fn().mockResolvedValue(some_deployment);
        persistenceHelper['removePVCFromDeployment'] = jest.fn();
        persistenceHelper['deletePVC'] = jest.fn();
        persistenceHelper['removePVCReferenceFromPV'] = jest.fn();
        yield persistenceHelper.detach(detachRequest);
        expect(persistenceHelper['getPersistentVolumeClaim']).toBeCalledWith(detachRequest.namespace, detachRequest.persistentVolumeClaimName);
        expect(persistenceHelper['getPersistentVolume']).toBeCalledWith(some_pvc.spec.volumeName);
        expect(persistenceHelper['setVolumeToRetain']).toBeCalledWith(some_pv);
        expect(persistenceHelper['getDeployment']).toBeCalledWith(detachRequest.namespace, detachRequest.appName);
        expect(persistenceHelper['removePVCFromDeployment']).toBeCalledWith(some_deployment, detachRequest.persistentVolumeClaimName);
        expect(persistenceHelper['deletePVC']).toBeCalledWith(some_pvc);
        expect(persistenceHelper['removePVCReferenceFromPV']).toBeCalledWith(some_pv);
    }));
    test('removePVCReferenceFromPV', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const persistenceHelper = new helper_1.Persistence();
        const some_error = 'err';
        const some_pv = {
            metadata: { name: some_name },
            spec: { capacity: { storage: some_storage } },
        };
        const patchMock = jest.fn().mockResolvedValue({ throwIfError: () => false, });
        persistenceHelper['cluster'] = {
            patch: patchMock
        };
        yield persistenceHelper.removePVCReferenceFromPV(some_pv);
        expect(patchMock).toBeCalledWith(some_pv, [
            {
                'op': 'remove',
                'path': `/spec/claimRef`
            }
        ]);
        const patchFailMock = jest.fn().mockResolvedValue({ error: some_error, throwIfError: () => true, });
        persistenceHelper['cluster'] = {
            patch: patchFailMock
        };
        yield expect(() => tslib_1.__awaiter(void 0, void 0, void 0, function* () { return yield persistenceHelper.removePVCReferenceFromPV(some_pv); }))
            .rejects.toThrow(some_error);
    }));
    test('removePVCFromDeployment', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const some_name1 = 'name1';
        const some_name2 = 'name2';
        const some_mount1 = {
            name: some_name1
        };
        const some_mount2 = {
            name: some_name2
        };
        const some_volume1 = {
            name: some_name1
        };
        const some_volume2 = {
            name: some_name2
        };
        const some_deployment = {
            document: {
                spec: {
                    template: {
                        spec: {
                            containers: [
                                { volumeMounts: [some_mount1, some_mount2] }
                            ],
                            volumes: [some_volume1, some_volume2],
                        }
                    }
                }
            }
        };
        const some_result = { throwIfError: () => false, };
        const persistenceHelper = new helper_1.Persistence();
        const patchMock = jest.fn().mockResolvedValue(some_result);
        persistenceHelper['cluster'] = {
            patch: patchMock
        };
        yield persistenceHelper.removePVCFromDeployment(some_deployment.document, some_name2);
        expect(patchMock).toHaveBeenNthCalledWith(1, some_deployment.document, [
            {
                'op': 'remove',
                'path': `/spec/template/spec/containers/0/volumeMounts/1`
            },
            {
                'op': 'remove',
                'path': `/spec/template/spec/volumes/1`
            }
        ]);
        const some_error = { error: 'err', throwIfError: () => { throw new Error('err'); } };
        const some_error1 = { error: 'err1', throwIfError: () => { throw new Error('err1'); } };
        const some_error2 = { error: 'err2', throwIfError: () => { throw new Error('err2'); } };
        const patchFailMock = jest.fn()
            .mockRejectedValue(some_error)
            .mockResolvedValueOnce(some_error1)
            .mockResolvedValueOnce(some_result)
            .mockResolvedValueOnce(some_error2);
        persistenceHelper['cluster'] = {
            patch: patchFailMock
        };
        yield expect(() => tslib_1.__awaiter(void 0, void 0, void 0, function* () { return yield persistenceHelper.removePVCFromDeployment(some_deployment.document, some_name2); }))
            .rejects.toThrow(some_error1.error);
    }));
    test('deletePVC', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const some_pvc = {
            mountPath: 'path',
            name: 'name',
            size: '5Gi',
        };
        const persistenceHelper = new helper_1.Persistence();
        const some_error = { error: 'err', throwIfError: () => { throw new Error(some_err); } };
        const some_result = { result: 'res', throwIfError: () => false, };
        const deleteMock = jest.fn().mockResolvedValue(some_result);
        persistenceHelper['cluster'] = {
            delete: deleteMock
        };
        yield persistenceHelper.deletePVC(some_pvc);
        expect(deleteMock).toBeCalledWith(some_pvc);
        const deleteFailMock = jest.fn().mockResolvedValue({ error: some_error, throwIfError: () => { throw new Error(some_err); } });
        persistenceHelper['cluster'] = {
            delete: deleteFailMock
        };
        yield expect(() => tslib_1.__awaiter(void 0, void 0, void 0, function* () { return yield persistenceHelper.deletePVC(some_pvc); }))
            .rejects.toThrow(some_error.error);
    }));
    test('setVolumeToRetain success', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const some_pv = {
            spec: { persistentVolumeReclaimPolicy: 'Delete' }
        };
        const persistenceHelper = new helper_1.Persistence();
        const some_error = { error: 'err', throwIfError: () => { throw new Error(some_err); } };
        const some_result = { result: 'res', throwIfError: () => false, };
        const patchMock = jest.fn().mockResolvedValue(some_result);
        persistenceHelper['cluster'] = {
            patch: patchMock
        };
        yield persistenceHelper.setVolumeToRetain(some_pv);
        const patchFailMock = jest.fn().mockResolvedValue({ error: some_error });
        persistenceHelper['cluster'] = {
            patch: patchFailMock
        };
        yield expect(() => tslib_1.__awaiter(void 0, void 0, void 0, function* () { return yield persistenceHelper.setVolumeToRetain(some_pv); }))
            .rejects.toThrow(some_error.error);
    }));
});
//# sourceMappingURL=detach.unit.js.map