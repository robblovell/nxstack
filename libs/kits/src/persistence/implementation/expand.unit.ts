import {expandMixin} from './expand'
import {Persistence} from '../helper'
import {ExpandRequest} from "@provisioner/contracts"

jest.mock('@c6o/kubeclient')

describe('Detach Helper', () => {
    const some_name = 'name'
    const some_storage = '5G'

    test('constructor()', () => {
        const ExpandHelper = expandMixin(Persistence)
        const result = new ExpandHelper()

        expect(result.cluster).toBeDefined()
        expect(result.expandImplementation).toBeDefined()
        expect(result.expandObject).toBeDefined()
        expect(result.expansionAllowedImplementation).toBeDefined()
        expect(result.validateExpand).toBeDefined()

        const persistenceHelper: Persistence = new Persistence()
        expect((persistenceHelper as any).expandImplementation).toBeDefined()
        expect((persistenceHelper as any).expandObject).toBeDefined()
        expect((persistenceHelper as any).expansionAllowedImplementation).toBeDefined()
        expect((persistenceHelper as any).validateExpand).toBeDefined()
    })

    test('async expand(request: ExpandRequest): Promise<Result>', async () => {

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
        const some_deployment = {
            name: 'name2', kind: 'kind2',
            metadata: {ownerReferences: [],},
        }
        const some_pv = {
            metadata: { name: some_name },
            spec: { capacity: { storage: some_storage }},
        }
        const expandRequest: ExpandRequest = {
            persistentVolumeClaimName: 'string',
            namespace: 'string',
            newSize: 5,
            capacityUnit: 'Gi',
            targetDoc: some_pvc
        }

        const persistenceHelper: Persistence = new Persistence()
        persistenceHelper['expandObject'] = jest.fn().mockResolvedValue(some_pvc)
        persistenceHelper['expansionAllowedImplementation'] = jest.fn().mockResolvedValue(some_pv)
        persistenceHelper['validateExpand'] = jest.fn()

        await persistenceHelper.expand(expandRequest)
        // TODO: expects for expand.

    })

})