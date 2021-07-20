"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const helper_1 = require("./helper");
jest.mock('@c6o/kubeclient');
describe('PersistenceHelper', () => {
    const some_name = 'name';
    const some_storage = '5G';
    test('constructor()', () => {
        const result = new helper_1.Persistence();
        expect(result.cluster).toBeDefined();
    });
    test.todo('async createPersistentVolumeClaim(request: AttachRequest, owners?: Array<Resource>)');
    test.todo('async copy(persisentvolumeClaimName: string, namespace: string, appId: string, targetVolumeName: string): Promise<Result>');
    test.todo('async getApplication(namespace, appName)');
    test.todo('async getDeployment(namespace, appName)');
    test.todo('async getPersistentVolume(volumeName)');
    test.todo('async getPersistentVolumeClaim(namespace, persistentVolumeClaimName, doNotThrow: boolean = false)');
    test.todo('async detach(request: DetachRequest): Promise<Result>');
    test.todo('private async addPVCToDeployment(doc: Resource, volumeClaimName: string, mountPoint: string): Promise<Result>');
    test.todo('private async removePVCReferenceFromPV(doc: Resource)');
    test.todo('private async removePVCFromDeployment(doc: Resource, name: string): Promise<Result>');
    test.todo('private async deletePVC(doc: Resource): Promise<Result>');
    test.todo('private async setVolumeToRetain(doc: Resource)');
    test.todo('async expand(request: ExpandRequest): Promise<Result>');
    test.todo('private async expandObject(doc: Resource, newSize: number, capacityUnit): Promise<Result>');
    test.todo('async expansionAllowed(request: ExpansionAllowedRequest): Promise<boolean>');
    test.todo('private async validateExpand(doc: Resource, newSize: number, capacityUnit)');
    test.todo('async list(request: any): Promise<Result>');
    test.todo('async restore(volumeSnapshotName: string, namespace: string, appId: string, persisentvolumeClaimName: string): Promise<Result>');
    test.todo('async snapshot(request: SnapshotRequest): Promise<Result>');
    test.todo('async snapshotAllowed(): Promise<boolean>');
});
//# sourceMappingURL=helper.unit.js.map