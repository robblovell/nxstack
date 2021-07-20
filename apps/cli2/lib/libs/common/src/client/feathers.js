"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeathersServiceFactory = void 0;
const tslib_1 = require("tslib");
const inversify_1 = require("inversify");
const __1 = require("../");
const mobx_1 = require("mobx");
const client_1 = tslib_1.__importDefault(require("@feathersjs/client"));
const socket_io_client_1 = tslib_1.__importDefault(require("socket.io-client"));
const authentication_client_1 = tslib_1.__importDefault(require("@feathersjs/authentication-client"));
let FeathersServiceFactory = class FeathersServiceFactory {
    init() {
        var _a, _b;
        try {
            if (this.url === undefined)
                throw new Error('URL is required');
            if (!this.storageKey)
                throw new Error('StorageKey is required');
            (_a = this.logger) === null || _a === void 0 ? void 0 : _a.info(`Initializing feathers factory with url ${this.url} & storage ${this.storageKey}`);
            this.client = client_1.default();
            const socket = socket_io_client_1.default(this.url, {
                transports: ['websocket'],
                path: '/api/ws/',
                upgrade: false
            });
            this.client.configure(client_1.default.socketio(socket));
            if (this.storage)
                this.client.configure(authentication_client_1.default({
                    path: '/api/authentication',
                    storage: this.storage,
                    storageKey: this.storageKey
                }));
            this.client.io.on('connect', () => this.online = true);
            this.client.io.on('disconnect', () => this.online = false);
        }
        catch (ex) {
            (_b = this.logger) === null || _b === void 0 ? void 0 : _b.error(ex);
        }
    }
    createService(name) {
        var _a;
        if (!this.client)
            this.init();
        (_a = this.logger) === null || _a === void 0 ? void 0 : _a.info(`Creating feathers service ${name}`);
        const service = this.client.service(name);
        return service;
    }
};
tslib_1.__decorate([
    mobx_1.observable,
    tslib_1.__metadata("design:type", Boolean)
], FeathersServiceFactory.prototype, "online", void 0);
tslib_1.__decorate([
    inversify_1.inject(__1.Symbols.logger),
    inversify_1.optional(),
    inversify_1.named('common:feathersServiceFactory'),
    tslib_1.__metadata("design:type", Object)
], FeathersServiceFactory.prototype, "logger", void 0);
FeathersServiceFactory = tslib_1.__decorate([
    inversify_1.injectable()
], FeathersServiceFactory);
exports.FeathersServiceFactory = FeathersServiceFactory;
//# sourceMappingURL=feathers.js.map