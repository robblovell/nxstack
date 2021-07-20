"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const feathers_1 = require("./feathers");
const socket_io_client_1 = tslib_1.__importDefault(require("socket.io-client"));
jest.mock('socket.io-client', () => {
    return jest.fn().mockImplementation(() => {
        return { socket: 'socket' };
    });
});
jest.mock('@feathersjs/client', () => {
    return () => {
        return {
            io: {
                on: jest.fn().mockReturnValue(true)
            },
            configure: jest.fn().mockReturnValue(true),
        };
    };
});
const client_1 = tslib_1.__importDefault(require("@feathersjs/client"));
client_1.default.socketio = jest.fn().mockImplementation((socket) => {
    return socket;
});
describe('FeathersServiceFactory Class', () => {
    const someName = 'some name';
    const someUrl = 'http://';
    const someStorageKey = 'someKey';
    beforeEach(() => {
        jest.clearAllMocks();
    });
    test('FeathersServiceFactory constructor', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        expect(() => { new feathers_1.FeathersServiceFactory(); }).not.toThrow();
    }));
    describe('init()', () => {
        test('Init throws and catches error if the url is not set.', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            const instance = new feathers_1.FeathersServiceFactory();
            instance.logger = {
                error: (error) => {
                    expect(error.message).toEqual('URL is required');
                }
            };
            instance.init();
        }));
        test('Init throws and catches error if the url is set but storageKey is not set.', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            const instance = new feathers_1.FeathersServiceFactory();
            instance.logger = {
                error: (error) => {
                    expect(error.message).toEqual('StorageKey is required');
                }
            };
            instance.url = someUrl;
            instance.storageKey = null;
            instance.init();
        }));
        test('Init creates feathers client', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            const instance = new feathers_1.FeathersServiceFactory();
            instance.logger = {
                info: (message) => {
                    expect(message).toEqual(`Initializing feathers factory with url ${someUrl} & storage ${someStorageKey}`);
                },
                error: (error) => {
                    expect(error.message).toEqual('No error expected. check the unit test.');
                }
            };
            instance.url = someUrl;
            instance.storageKey = someStorageKey;
            instance.init();
            expect(instance.client).toBeDefined();
            expect(instance.client.configure).toHaveBeenCalledWith({ 'socket': 'socket' });
            expect(instance.client.io.on.mock.calls).toEqual([
                [
                    'connect',
                    expect.any(Function),
                ],
                [
                    'disconnect',
                    expect.any(Function),
                ],
            ]);
            expect(client_1.default.socketio).toHaveBeenCalledWith({ 'socket': 'socket' });
            expect(socket_io_client_1.default).toHaveBeenCalledWith('http://', { 'path': '/api/ws/', 'transports': ['websocket'], 'upgrade': false });
        }));
    });
    describe('createService()', () => {
        test('createService() with client already created.', () => {
            const instance = new feathers_1.FeathersServiceFactory();
            instance.logger = {
                info: (message) => {
                    expect(message).toEqual(`Creating feathers service ${someName}`);
                },
                error: (error) => {
                    expect(error.message).toEqual('No error expected. check the unit test.');
                }
            };
            instance.url = someUrl;
            instance.storageKey = someStorageKey;
            instance.client = { service: jest.fn().mockReturnValue('aService') };
            instance.init = jest.fn().mockReturnValue(true);
            instance.createService(someName);
            expect(instance.init).toHaveBeenCalledTimes(0);
            expect(instance.client.service).toHaveBeenCalledWith(someName);
        });
        test('createService() with client still null', () => {
            const instance = new feathers_1.FeathersServiceFactory();
            instance.logger = {
                info: (message) => {
                    expect(message).toEqual(`Creating feathers service ${someName}`);
                },
                error: (error) => {
                    expect(error.message).toEqual('No error expected. check the unit test.');
                }
            };
            instance.url = someUrl;
            instance.storageKey = someStorageKey;
            instance.client = null;
            instance.init = jest.fn().mockImplementation(() => {
                instance.client = { service: jest.fn().mockReturnValue('aService') };
            });
            instance.createService(someName);
            expect(instance.init).toHaveBeenCalledTimes(1);
            expect(instance.client.service).toHaveBeenCalledWith(someName);
        });
    });
});
//# sourceMappingURL=feathers.unit.js.map