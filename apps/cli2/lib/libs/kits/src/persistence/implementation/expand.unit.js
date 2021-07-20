"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const expand_1 = require("./expand");
const helper_1 = require("../helper");
jest.mock('@c6o/kubeclient');
describe('Detach Helper', () => {
    const some_name = 'name';
    const some_storage = '5G';
    test('constructor()', () => {
        const ExpandHelper = expand_1.expandMixin(helper_1.Persistence);
        const result = new ExpandHelper();
        expect(result.cluster).toBeDefined();
        expect(result.expandImplementation).toBeDefined();
        expect(result.expandObject).toBeDefined();
        expect(result.expansionAllowedImplementation).toBeDefined();
        expect(result.validateExpand).toBeDefined();
        const persistenceHelper = new helper_1.Persistence();
        expect(persistenceHelper.expandImplementation).toBeDefined();
        expect(persistenceHelper.expandObject).toBeDefined();
        expect(persistenceHelper.expansionAllowedImplementation).toBeDefined();
        expect(persistenceHelper.validateExpand).toBeDefined();
    });
    test('async expand(request: ExpandRequest): Promise<Result>', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
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
        const some_deployment = {
            name: 'name2', kind: 'kind2',
            metadata: { ownerReferences: [], },
        };
        const some_pv = {
            metadata: { name: some_name },
            spec: { capacity: { storage: some_storage } },
        };
        const expandRequest = {
            persistentVolumeClaimName: 'string',
            namespace: 'string',
            newSize: 5,
            capacityUnit: 'Gi',
            targetDoc: some_pvc
        };
        const persistenceHelper = new helper_1.Persistence();
        persistenceHelper['expandObject'] = jest.fn().mockResolvedValue(some_pvc);
        persistenceHelper['expansionAllowedImplementation'] = jest.fn().mockResolvedValue(some_pv);
        persistenceHelper['validateExpand'] = jest.fn();
        yield persistenceHelper.expand(expandRequest);
    }));
});
//# sourceMappingURL=expand.unit.js.map