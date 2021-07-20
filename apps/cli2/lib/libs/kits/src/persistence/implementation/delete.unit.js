"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const delete_1 = require("./delete");
const helper_1 = require("../helper");
jest.mock('@c6o/kubeclient');
describe('Delete Helper', () => {
    const some_name = 'name';
    const some_storage = '5G';
    test('constructor()', () => {
        const DeleteHelper = delete_1.deleteMixin(helper_1.Persistence);
        const result = new DeleteHelper();
        expect(result.cluster).toBeDefined();
    });
    test('async deleteImplementation(request: DeleteRequest): Promise<Result>', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const persistenceHelper = new helper_1.Persistence();
        const some_pv = {
            metadata: { name: some_name },
            spec: { capacity: { storage: some_storage } },
        };
        const some_pvc = {
            spec: {
                volumeName: some_name,
                resources: {
                    requests: {
                        storage: some_storage
                    }
                }
            }
        };
        const delete_request = {
            persistentVolumeName: 'somename',
        };
        const getMock1 = jest.fn().mockResolvedValue(some_pvc);
        persistenceHelper['getPersistentVolumeClaim'] = getMock1;
        const getMock2 = jest.fn().mockResolvedValue({});
        persistenceHelper['getPersistentVolume'] = getMock2;
        const setMock1 = jest.fn().mockResolvedValue({});
        persistenceHelper['setRetainPolicyToDelete'] = setMock1;
        const getMock3 = jest.fn().mockResolvedValue({});
        persistenceHelper['getDeployment'] = getMock3;
        const removeMock1 = jest.fn().mockResolvedValue({});
        persistenceHelper['removePVCFromDeployment'] = removeMock1;
        const deleteMock1 = jest.fn().mockResolvedValue({});
        persistenceHelper['deletePVC'] = deleteMock1;
        const removeMock2 = jest.fn().mockResolvedValue({});
        persistenceHelper['removePVCReferenceFromPV'] = removeMock2;
        yield persistenceHelper['deleteImplementation'](delete_request);
        expect(getMock2).toBeCalled();
        expect(setMock1).toBeCalled();
    }));
    describe('setRetainPolicyToDelete', () => {
        const some_doc = {};
        const some_err = 'some_err';
        test('async setRetainPolicyToDelete(doc: Resource) fails', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            const persistenceHelper = new helper_1.Persistence();
            const patchFailMock = jest.fn().mockResolvedValue({ error: some_err, throwIfError: () => { throw new Error(some_err); }, });
            persistenceHelper['cluster'] = {
                patch: patchFailMock
            };
            yield expect(() => tslib_1.__awaiter(void 0, void 0, void 0, function* () { return yield persistenceHelper['setRetainPolicyToDelete'](some_doc); }))
                .rejects.toThrow(some_err);
            expect(patchFailMock).toBeCalled();
        }));
        test('async setRetainPolicyToDelete(doc: Resource) succeeds', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            const persistenceHelper = new helper_1.Persistence();
            const patchMock = jest.fn().mockResolvedValue({ throwIfError: () => false, });
            persistenceHelper['cluster'] = {
                patch: patchMock
            };
            yield persistenceHelper['setRetainPolicyToDelete'](some_doc);
            expect(patchMock).toBeCalledWith(some_doc, [
                {
                    'op': 'replace',
                    'path': '/spec/persistentVolumeReclaimPolicy',
                    'value': 'Delete',
                }
            ]);
        }));
    });
    test.todo('getPersistentVolumeClaimFromVolume');
});
//# sourceMappingURL=delete.unit.js.map