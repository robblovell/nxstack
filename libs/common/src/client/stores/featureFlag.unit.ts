/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/camelcase */

jest.mock('@splitsoftware/splitio', () => {
    return {
        __esModule: true,
        SplitFactory: jest.fn().mockReturnValue({
            client: jest.fn().mockReturnValue({
                on: jest.fn()
            }),
        })
    }
})
jest.mock('ulid', () => {
    return {
        ulid: jest.fn().mockReturnValue(2)
    }
})

import { FeatureFlagStore } from './featureFlag'
import { SplitFactory } from '@splitsoftware/splitio'
import { ulid } from 'ulid'

describe('Feature', () => {

    const some_key = '1234'

    describe('initialization', () => {
        test('init', async () => {
            const feature = new FeatureFlagStore()
            feature.config = {
                get: jest.fn().mockReturnValue(some_key)
            }
            feature.init()
            expect(feature.config.get).toBeCalledWith('FEATURE_AUTHORIZATION_KEY')
            expect(SplitFactory).toBeCalledWith({
                'core': {
                    'authorizationKey': '1234',
                    'key': undefined, // TODO: should this be a guid?
                },
                'startup': {
                    'readyTimeout': 5,
                    'requestTimeoutBeforeReady': 5,
                },
                'storage': {
                    'prefix': 'c6o',
                    'type': 'LOCALSTORAGE',
                },
            },)
        })

        test('no key throws', async () => {
            const feature = new FeatureFlagStore()
            feature.config = {
                get: jest.fn().mockReturnValue(null)
            }
            await expect(() => (feature.init())).toThrow('FEATURE_AUTHORIZATION_KEY is required before initializing a feature store')
        })
    })
    describe('feature flag usage methods', () => {
        const A_USER_ID = '1'
        const feature = new FeatureFlagStore()
        feature.config = {
            get: jest.fn().mockReturnValue(some_key)
        }
        feature.init()
        feature['logger'] = {
            info: jest.fn(),
        } as any

        test('getAnonymousUser', () => {
            feature.storage = {
                setItem: jest.fn(),
                getItem: jest.fn().mockReturnValue(undefined)
            }
            expect(feature['getAnonymousUser']()).toBe(2)
            expect(ulid).toBeCalled()
            expect(feature.storage.setItem).toBeCalledWith('c6o-anon', 2)

            feature.storage.getItem = jest.fn().mockReturnValue(A_USER_ID)
            expect(feature['getAnonymousUser']()).toBe(A_USER_ID)
        })

        test('flag', () => {
            const getTreatmentMock = jest.fn().mockReturnValue('on')
            feature['_client'] = {
                getTreatment: getTreatmentMock
            } as any
            const SOME_NAME = 'A'
            const SOME_ATTRIBUTES = { email: 'some email'}
            expect(feature.flag(SOME_NAME)).toBe(true)
            expect(getTreatmentMock).toBeCalledWith(SOME_NAME, {})
            expect(feature.flag(SOME_NAME, 'on')).toBe(true)
            expect(getTreatmentMock).toBeCalledWith(SOME_NAME, {})
            expect(feature.flag(SOME_NAME, 'off')).toBe(false)
            expect(getTreatmentMock).toBeCalledWith(SOME_NAME, {})
            expect(feature.flag(SOME_NAME, 'off', SOME_ATTRIBUTES)).toBe(false)
            expect(getTreatmentMock).toBeCalledWith(SOME_NAME, SOME_ATTRIBUTES)

            feature['_client'] = undefined
            expect(feature.flag('A')).toBe(false)
        })

        test('setUser', async () => {
            const ANOTHER_USER = '2'
            const SDK_READY = 1
            const SDK_UPDATE = 2
            feature.storage = {
                setItem: jest.fn(),
                getItem: jest.fn().mockReturnValue(A_USER_ID)
            }
            let readyClosure, updateClosure
            const onMock = jest.fn().mockImplementation((event, fun) => {
                if (event === SDK_UPDATE){
                    updateClosure = fun
                }
                else if (event === SDK_READY) {
                    readyClosure = fun
                }
                return Promise.resolve()
            })
            const clientMock = jest.fn().mockReturnValue({
                on: onMock,
                Event: {
                    SDK_READY: SDK_READY,
                    SDK_UPDATE: SDK_UPDATE,
                },
            })
            feature['_factory'] = {
                client: clientMock,
            } as any
            feature['_trackingId'] = ANOTHER_USER
            feature['_client'] = undefined
            // NO Parameter
            feature.setUser()
            expect(feature['_trackingId']).toEqual(A_USER_ID)
            expect(onMock).toBeCalledTimes(2)
            expect(onMock).toHaveBeenNthCalledWith(1, clientMock().Event.SDK_READY, expect.any(Function))
            expect(onMock).toHaveBeenNthCalledWith(2, clientMock().Event.SDK_UPDATE, expect.any(Function))
            expect(clientMock).toBeCalledWith(A_USER_ID)

            // test readyClosure, updateClosure
            expect (feature.initialized).toBe(false)
            readyClosure()
            expect (feature.initialized).toBe(true)
            expect (feature.initialized).toBe(true)
            updateClosure()
            expect(feature['logger'].info).toBeCalledWith('Flags updated')

            // Given a Parameter
            feature.setUser(ANOTHER_USER)
            expect(clientMock).toBeCalledWith(ANOTHER_USER)

            // Early return tests:
            feature['_trackingId'] = A_USER_ID
            clientMock.mockReset()
            feature.setUser(A_USER_ID)
            expect(clientMock).not.toBeCalled()


        })



    })
})
