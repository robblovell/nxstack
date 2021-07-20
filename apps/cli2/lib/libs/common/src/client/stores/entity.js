"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EntityStore = void 0;
const tslib_1 = require("tslib");
const inversify_1 = require("inversify");
const base_1 = require("./base");
const mobx_1 = require("mobx");
let EntityStore = class EntityStore extends base_1.BaseServiceStore {
    constructor(serviceName) {
        super(serviceName);
        this._triggerInitialized = false;
        this.pending = {};
    }
    get hasEntity() { return this.id; }
    get hasPending() { return !!Object.keys(this.pending).length; }
    get nullState() { return !this.hasEntity; }
    get initialized() {
        if (this._initialized)
            return this._initialized;
        return this._initialized = this._triggerInitialized || !!this.id || this.hasErrors;
    }
    get id() { var _a; return (_a = this.entity) === null || _a === void 0 ? void 0 : _a._id; }
    set id(id) {
        this.get(id);
    }
    init() {
        super.init();
        if (this.service) {
            this.service.on('updated', this.onUpdated);
            this.service.on('patched', this.onPatched);
            this.service.on('removed', this.onRemoved);
        }
    }
    _preServiceRequest() {
        this.busy = true;
        this.serviceRequestSuccess = false;
        this.clearErrors();
    }
    _postServiceRequest() {
        this.busy = false;
        if (this.isValid) {
            this.reset();
            this.serviceRequestSuccess = true;
        }
    }
    onUpdated(entity) {
        if (!this.isMyEntity(entity))
            return;
        this.entity = entity;
        this.reset();
        this.logger.info(`${this.serviceName} updated`, entity);
    }
    onPatched(patch) {
        if (!this.isMyEntity(patch))
            return;
        this.entity = Object.assign(this.entity, patch);
        this.reset();
        this.logger.info(`${this.serviceName} patched`, patch);
    }
    onRemoved(entity) {
        if (this.isMyEntity(entity)) {
            this.entity.removed = true;
            this.reset();
            this.logger.info(`${this.serviceName} removed`);
        }
    }
    queryHook() { return {}; }
    isMyEntity(entity) {
        if (!entity || !this.entity)
            return false;
        return entity._id === this.entity._id;
    }
    reset() {
        super.reset();
        this.pending = {};
        this.serviceRequestSuccess = false;
    }
    get(id = null) {
        var _a;
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            this.disposeGuard();
            const entityId = id || ((_a = this.entity) === null || _a === void 0 ? void 0 : _a._id);
            if (!entityId)
                throw new Error('id is required to get entity');
            try {
                this.busy = true;
                this.clearErrors();
                const query = this.queryHook();
                this.entity = yield this.service.get(entityId, { query });
            }
            catch (ex) {
                this.logger.error(ex);
                this.errors = ex;
            }
            finally {
                this.busy = false;
            }
        });
    }
    save() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            this.hasEntity ? yield this.patch() : yield this.create();
        });
    }
    create() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            this.disposeGuard();
            if (this.hasEntity) {
                throw new Error('Create cannot be called once an entity has been retrieved');
            }
            try {
                this._preServiceRequest();
                this.createValidate();
                if (this.isValid)
                    this.entity = yield this.service.create(this.pending);
            }
            catch (ex) {
                this.logger.error(ex);
                this.errors = ex;
            }
            finally {
                this._postServiceRequest();
            }
        });
    }
    update() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            this.disposeGuard();
            if (!this.entity) {
                throw new Error('entity is required to update entity');
            }
            if (!this.id) {
                throw new Error('id is required to update entity');
            }
            if (this.entity.removed) {
                throw new Error('Attempt to update removed entity');
            }
            try {
                this._preServiceRequest();
                this.updateValidate();
                if (this.isValid)
                    yield this.service.update(this.id, this.entity);
            }
            catch (ex) {
                this.logger.error(ex);
                this.errors = ex;
            }
            finally {
                this._postServiceRequest();
            }
        });
    }
    patch() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            this.disposeGuard();
            if (!this.entity) {
                throw new Error('entity is required to patch an entity');
            }
            if (!this.id) {
                throw new Error('id is required to patch entity');
            }
            if (this.entity.removed) {
                throw new Error('Attempt to patch removed entity');
            }
            if (!this.hasPending) {
                this.setError('pending', 'No changes were made');
                return;
            }
            try {
                this._preServiceRequest();
                this.patchValidate();
                if (this.isValid)
                    yield this.service.patch(this.id, this.pending);
            }
            catch (ex) {
                this.logger.error(ex);
                this.errors = ex;
            }
            finally {
                this._postServiceRequest();
            }
        });
    }
    remove(params = {}) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            this.disposeGuard();
            if (!this.entity) {
                throw new Error('entity is required to patch an entity');
            }
            if (!this.id) {
                throw new Error('id is required to remove entity');
            }
            if (this.entity.removed) {
                throw new Error('Attempt to remove entity that has already been removed');
            }
            try {
                this._preServiceRequest();
                yield this.service.remove(this.id, params);
            }
            catch (ex) {
                this.logger.error(ex);
                this.errors = ex;
            }
            finally {
                this._postServiceRequest();
            }
        });
    }
    mapAjvErrors(errors) {
        if (!errors || !errors.length)
            return null;
        errors.map((error) => {
            if (error.dataPath && error.dataPath.length) {
                const field = error.dataPath.slice(1);
                this.setError(field, error.message);
            }
        });
        return this.errors;
    }
    createValidate() {
        super.reset();
        if (this.createValidator) {
            if (!this.createValidator(this.pending)) {
                this.mapAjvErrors(this.createValidator.errors);
            }
        }
    }
    patchValidate() {
        super.reset();
        if (this.patchValidator) {
            if (!this.patchValidator(this.pending)) {
                this.mapAjvErrors(this.patchValidator.errors);
            }
        }
    }
    updateValidate() {
        super.reset();
        if (this.updateValidator) {
            if (!this.updateValidator(this.pending)) {
                this.mapAjvErrors(this.updateValidator.errors);
            }
        }
    }
    propagateServiceRequestResult(store) {
        if (store.hasErrors) {
            this.errors = store.errors;
        }
        else {
            this.clearErrors();
            this.serviceRequestSuccess = store.serviceRequestSuccess;
        }
    }
};
tslib_1.__decorate([
    mobx_1.observable,
    tslib_1.__metadata("design:type", Object)
], EntityStore.prototype, "entity", void 0);
tslib_1.__decorate([
    mobx_1.observable,
    tslib_1.__metadata("design:type", Object)
], EntityStore.prototype, "_triggerInitialized", void 0);
tslib_1.__decorate([
    mobx_1.observable,
    tslib_1.__metadata("design:type", Object)
], EntityStore.prototype, "pending", void 0);
tslib_1.__decorate([
    mobx_1.observable,
    tslib_1.__metadata("design:type", Boolean)
], EntityStore.prototype, "serviceRequestSuccess", void 0);
tslib_1.__decorate([
    mobx_1.computed,
    tslib_1.__metadata("design:type", Object),
    tslib_1.__metadata("design:paramtypes", [])
], EntityStore.prototype, "hasEntity", null);
tslib_1.__decorate([
    mobx_1.computed,
    tslib_1.__metadata("design:type", Object),
    tslib_1.__metadata("design:paramtypes", [])
], EntityStore.prototype, "hasPending", null);
tslib_1.__decorate([
    mobx_1.computed,
    tslib_1.__metadata("design:type", Object),
    tslib_1.__metadata("design:paramtypes", [])
], EntityStore.prototype, "nullState", null);
tslib_1.__decorate([
    mobx_1.computed,
    tslib_1.__metadata("design:type", Object),
    tslib_1.__metadata("design:paramtypes", [])
], EntityStore.prototype, "initialized", null);
tslib_1.__decorate([
    mobx_1.computed,
    tslib_1.__metadata("design:type", Object),
    tslib_1.__metadata("design:paramtypes", [Object])
], EntityStore.prototype, "id", null);
tslib_1.__decorate([
    mobx_1.action.bound,
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", void 0)
], EntityStore.prototype, "onUpdated", null);
tslib_1.__decorate([
    mobx_1.action.bound,
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", void 0)
], EntityStore.prototype, "onPatched", null);
tslib_1.__decorate([
    mobx_1.action.bound,
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", void 0)
], EntityStore.prototype, "onRemoved", null);
tslib_1.__decorate([
    mobx_1.action.bound,
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", void 0)
], EntityStore.prototype, "reset", null);
tslib_1.__decorate([
    mobx_1.action.bound,
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], EntityStore.prototype, "get", null);
tslib_1.__decorate([
    mobx_1.action.bound,
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], EntityStore.prototype, "save", null);
tslib_1.__decorate([
    mobx_1.action.bound,
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], EntityStore.prototype, "create", null);
tslib_1.__decorate([
    mobx_1.action.bound,
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], EntityStore.prototype, "update", null);
tslib_1.__decorate([
    mobx_1.action.bound,
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], EntityStore.prototype, "patch", null);
EntityStore = tslib_1.__decorate([
    inversify_1.injectable(),
    tslib_1.__metadata("design:paramtypes", [String])
], EntityStore);
exports.EntityStore = EntityStore;
//# sourceMappingURL=entity.js.map