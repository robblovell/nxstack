"use strict";
var BaseStore_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseServiceStore = exports.BaseStore = void 0;
const tslib_1 = require("tslib");
require("reflect-metadata");
const inversify_1 = require("inversify");
const mobx_1 = require("mobx");
const symbols_1 = require("../../DI/symbols");
let BaseStore = BaseStore_1 = class BaseStore {
    constructor() {
        this.disposed = false;
        this.busy = false;
        this.errors = {};
        this.instanceId = BaseStore_1.instanceCounter++;
    }
    get hasErrors() { var _a; return !!Object.keys(this.errors).length || !!((_a = this.errors) === null || _a === void 0 ? void 0 : _a.message); }
    get isValid() { return !this.hasErrors; }
    dispose() {
        this.disposed = true;
    }
    disposeGuard() {
        if (this.disposed)
            throw new Error(`Attempted to use disposed instance ID: ${this.instanceId}`);
    }
    reset() {
        this.clearErrors();
    }
    clearErrors() {
        this.errors = {};
    }
    setError(field, message) {
        const regex = /\//ig;
        this.errors = Object.assign({}, this.errors, {
            [field.replace(regex, '.')]: { message }
        });
    }
    clearError(field) {
        delete this.errors[field];
    }
};
BaseStore.instanceCounter = 0;
tslib_1.__decorate([
    inversify_1.inject(symbols_1.Symbols.logger),
    inversify_1.named('common:BaseStore'),
    tslib_1.__metadata("design:type", Object)
], BaseStore.prototype, "logger", void 0);
tslib_1.__decorate([
    mobx_1.observable,
    tslib_1.__metadata("design:type", Object)
], BaseStore.prototype, "busy", void 0);
tslib_1.__decorate([
    mobx_1.observable,
    tslib_1.__metadata("design:type", Object)
], BaseStore.prototype, "errors", void 0);
tslib_1.__decorate([
    mobx_1.computed,
    tslib_1.__metadata("design:type", Object),
    tslib_1.__metadata("design:paramtypes", [])
], BaseStore.prototype, "hasErrors", null);
tslib_1.__decorate([
    mobx_1.computed,
    tslib_1.__metadata("design:type", Object),
    tslib_1.__metadata("design:paramtypes", [])
], BaseStore.prototype, "isValid", null);
tslib_1.__decorate([
    mobx_1.action.bound,
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", void 0)
], BaseStore.prototype, "clearError", null);
BaseStore = BaseStore_1 = tslib_1.__decorate([
    inversify_1.injectable(),
    tslib_1.__metadata("design:paramtypes", [])
], BaseStore);
exports.BaseStore = BaseStore;
let BaseServiceStore = class BaseServiceStore extends BaseStore {
    constructor(serviceName) {
        super();
        this.serviceName = serviceName;
    }
    init() {
        this.createService();
    }
    disposeGuard() {
        if (this.disposed)
            throw new Error(`Attempted to use disposed instance ID ${this.instanceId} for service: ${this.serviceName}`);
    }
    createService() {
        if (!this.serviceName)
            return false;
        if (!this.feathersServiceFactory)
            throw new Error('A Feathers service factory is required');
        this.service = this.feathersServiceFactory.createService(this.serviceName);
        return true;
    }
};
tslib_1.__decorate([
    inversify_1.postConstruct(),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", void 0)
], BaseServiceStore.prototype, "init", null);
BaseServiceStore = tslib_1.__decorate([
    inversify_1.injectable(),
    tslib_1.__metadata("design:paramtypes", [String])
], BaseServiceStore);
exports.BaseServiceStore = BaseServiceStore;
//# sourceMappingURL=base.js.map