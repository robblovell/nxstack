import { FeathersServiceFactory } from './feathers'
import { Logger } from '@c6o/logger'
import io from 'socket.io-client'
import { Application } from '@feathersjs/feathers'

jest.mock('socket.io-client', () => {
    return jest.fn().mockImplementation(() => {
        return { socket: 'socket' }
    })
})
jest.mock('@feathersjs/client',() => {
    return () => {
        return {
            io: {
                on: jest.fn().mockReturnValue(true)
            },
            configure: jest.fn().mockReturnValue(true),
        }
    }
})
import feathers from '@feathersjs/client'
// feathers.socketio = jest.fn().mockReturnValue(socket)
// feathers.socketio = ((socket) => {
//     return socket
// }) as any
feathers.socketio = jest.fn().mockImplementation((socket) => {
    return socket
}) as never
describe('FeathersServiceFactory Class', () => {
    const someName = 'some name'
    const someUrl = 'http://'
    const someStorageKey = 'someKey'

    beforeEach(() => {
        // Clear all instances and calls to constructor and all methods:
        jest.clearAllMocks()
    })

    test('FeathersServiceFactory constructor', async () => {
        expect(() => { new FeathersServiceFactory() }).not.toThrow()
    })

    describe('init()', () => {
        test('Init throws and catches error if the url is not set.', async () => {
            const instance = new FeathersServiceFactory()
            // TODO: use mockloger and inject
            instance.logger = {
                error:(error) => {
                    expect(error.message).toEqual('URL is required')
                }
            } as Logger
            instance.init()
        })
        test('Init throws and catches error if the url is set but storageKey is not set.', async () => {
            const instance = new FeathersServiceFactory()

            instance.logger = {
                error:(error) => {
                    expect(error.message).toEqual('StorageKey is required')
                }
            } as Logger
            instance.url = someUrl
            instance.storageKey = null
            instance.init()
        })
        test('Init creates feathers client', async () => {
            const instance = new FeathersServiceFactory()

            instance.logger = {
                info:(message) => {
                    expect(message).toEqual(`Initializing feathers factory with url ${someUrl} & storage ${someStorageKey}`)
                },
                error:(error) => {
                    expect(error.message).toEqual('No error expected. check the unit test.')
                }
            } as Logger
            instance.url = someUrl
            instance.storageKey = someStorageKey
            instance.init()
            expect(instance.client).toBeDefined()
            expect(instance.client.configure).toHaveBeenCalledWith({'socket': 'socket'})
            expect(instance.client.io.on.mock.calls).toEqual([
                [
                    'connect',
                    expect.any(Function),
                ],
                [
                    'disconnect',
                    expect.any(Function),
                ],
            ])
            expect(feathers.socketio).toHaveBeenCalledWith({ 'socket': 'socket'})
            expect(io).toHaveBeenCalledWith('http://', {'path': '/api/ws/', 'transports': ['websocket'], 'upgrade': false})
        })
    })
    describe('createService()', () => {
        test('createService() with client already created.', () => {
            const instance = new FeathersServiceFactory()
            instance.logger = {
                info: (message) => {
                    expect(message).toEqual(`Creating feathers service ${someName}`)
                },
                error: (error) => {
                    expect(error.message).toEqual('No error expected. check the unit test.')
                }
            } as Logger
            instance.url = someUrl
            instance.storageKey = someStorageKey
            instance.client = {service: jest.fn().mockReturnValue('aService')} as never as Application<unknown>
            instance.init = jest.fn().mockReturnValue(true)

            instance.createService(someName)
            expect(instance.init).toHaveBeenCalledTimes(0)
            expect(instance.client.service).toHaveBeenCalledWith(someName)
        })

        test('createService() with client still null', () => {
            const instance = new FeathersServiceFactory()
            instance.logger = {
                info: (message) => {
                    expect(message).toEqual(`Creating feathers service ${someName}`)
                },
                error: (error) => {
                    expect(error.message).toEqual('No error expected. check the unit test.')
                }
            } as Logger
            instance.url = someUrl
            instance.storageKey = someStorageKey

            instance.client = null
            instance.init = jest.fn().mockImplementation(() => {
                instance.client = {service: jest.fn().mockReturnValue('aService')} as never
            })
            instance.createService(someName)
            expect(instance.init).toHaveBeenCalledTimes(1)
            expect(instance.client.service).toHaveBeenCalledWith(someName)
        })
    })
})
