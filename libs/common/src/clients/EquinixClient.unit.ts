import { EquinixClient } from './EquinixClient';

const SOME_CAPABILITIES = {
    facility: {
        fac1: {
            level: '1',
        },
        fac2: {
            level: '2',
        },
        fac3: {
            level: '3',
        },
    },
    other: {
        fac4: {
            level: '4',
        }
    }
}
const SOME_DATA = {
    data: {
        capacity: SOME_CAPABILITIES,
        facilities: 'facilities',
        projects: 'projects',
        ssh_keys: 'ssh_keys',
    }
}

jest.mock('axios', () => {
    return {
        get: jest.fn()
            .mockResolvedValue({ // can't use constants here because jest.mock hoists.
                data: {
                    capacity: {
                        facility: {
                            fac1: {
                                level: '1',
                            },
                            fac2: {
                                level: '2',
                            },
                            fac3: {
                                level: '3',
                            },
                        },
                        other: {
                            fac4: {
                                level: '4',
                            }
                        }
                    },
                    facilities: 'facilities',
                    projects: 'projects',
                    ssh_keys: 'ssh_keys',
                }
            }),
        post: jest.fn().mockResolvedValue({ data: { 'kubernetes_cluster': 'post' } }),
        patch: jest.fn().mockResolvedValue('patch'),
        delete: jest.fn().mockResolvedValue('delete'),
    }
})
jest.mock('inversify')
jest.mock('node-jose', () => {
    return {
        JWS: {
            createSign: jest.fn().mockReturnValue({
                update: jest.fn().mockReturnValue({
                    final: jest.fn().mockReturnValue('final'),
                }),
            }),
        },
        JWK: {
            asKey: jest.fn(),
        }
    }
})
import axios from 'axios'

describe('EquinixClient Class', () => {

    beforeEach(() => {
        jest.clearAllMocks()
    })

    test('get apiURL()', () => {
        const instance = new EquinixClient()
        expect(instance.apiURL).toBe('https://api.equinix.com/metal/v1')
    })

    test('async headers(service, data?, headers?)', async () => {
        const instance = new EquinixClient()
        const SOME_SERVICE = 'service'
        const SOME_DATA = 'data'
        const SOME_HEADERS = { header: 'header' }
        const SOME_ID = 'id'
        const SOME_TOKEN = 'token1'
        process.env.EQUINIX_USER_API_KEY = 'token2'

        instance.privateKey = 'key'
        instance.jwkId = SOME_ID
        const EXPECTED_RESULT = {
            'Accept': 'application/json, text/plain',
            'X-Auth-Token': process.env.EQUINIX_USER_API_KEY,
            'header': 'header',
            'jwkId': 'id',
            'jws': 'final',
        }
        const case1 = await instance.headers(SOME_SERVICE, SOME_DATA, SOME_HEADERS)
        expect(case1).toEqual(EXPECTED_RESULT)

        instance.token = SOME_TOKEN
        const EXPECTED_RESULT2 = {
            'Accept': 'application/json, text/plain',
            'X-Auth-Token': SOME_TOKEN,
            'header': 'header',
        }
        const case2 = await instance.headers(SOME_SERVICE, SOME_DATA, SOME_HEADERS)
        expect(case2).toEqual(EXPECTED_RESULT2)
    })

    test('getCapacities = async ()', async () => {
        const instance = new EquinixClient()
        const result = await instance.getCapacities()
        expect(result).toEqual(SOME_CAPABILITIES)
    })

    test('getFacilities = async ()', async () => {
        const instance = new EquinixClient()
        const result = await instance.getFacilities()
        expect(result).toEqual('facilities')
    })

    test('getProjects = async ()', async () => {
        const instance = new EquinixClient()
        const result = await instance.getProjects()
        expect(result).toEqual('projects')
    })

    test('getSshKey = async (id: string): Promise<any> =>', async () => {
        const SOME_ID = '1'
        const instance = new EquinixClient()
        const getSpy = jest.spyOn(instance, 'get')
        const result = await instance.getSshKey(SOME_ID)
        expect(getSpy).toBeCalledWith(`/ssh-keys/${SOME_ID}`)
        expect(result).toEqual(SOME_DATA.data)
    })

    test('getUserSshKeys = async ()', async () => {
        const instance = new EquinixClient()
        const result = await instance.getUserSshKeys()
        expect(result).toEqual('ssh_keys')
    })

    test('getFacilitiesSupportingFeatures = async async (requiredFeatures?: string[], levels?: string[])', async () => {
    })

    test('getAllMachineTypes = async ()', async () => {
        const SOME_RESULT = [
            {
                'facilityCode': 'facility',
                'machineType': [
                    'fac1',
                    'fac3'
                ]
            }
        ]
        const instance = new EquinixClient()
        const SOME_LEVELS = ['1','3']
        const result = await instance.getAllMachineTypes(SOME_LEVELS)
        expect(result).toEqual(SOME_RESULT)
    })

    test('getFacilityMachineTypes = async ()', async () => {
        const instance = new EquinixClient()
        const SOME_CODE = 'facility'
        const SOME_LEVELS = ['1','3']
        const case1 = await instance.getFacilityMachineTypes(SOME_CODE, SOME_LEVELS)
        expect(case1).toEqual(['fac1', 'fac3'])
        const OTHER_LEVELS = ['2']
        const case2 = await instance.getFacilityMachineTypes(SOME_CODE, OTHER_LEVELS)
        expect(case2).toEqual(['fac2'])

    })
})
