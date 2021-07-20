"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EntityListStore = void 0;
const tslib_1 = require("tslib");
const base_1 = require("./base");
const mobx_1 = require("mobx");
const __1 = require("../../");
const unset = -1;
class EntityListStore extends base_1.BaseServiceStore {
    constructor(serviceName, entityStoreSymbol) {
        super(serviceName);
        this.entityStoreSymbol = entityStoreSymbol;
        this._entityStores = [];
        this.entities = [];
        this.filter = {};
        this.limit = unset;
        this.skip = unset;
        this.state = 'uninitialized';
        this.total = unset;
        this.monitor = () => mobx_1.observe(this.feathersServiceFactory, 'online', () => tslib_1.__awaiter(this, void 0, void 0, function* () { return yield this.fetch(); }), true);
    }
    get entityStores() {
        this.logger.info(`Generating ${this.serviceName} ${this.instanceId}`, this.entities.length);
        for (const entityStore of this._entityStores)
            entityStore.dispose();
        this._entityStores = this.entities.map(entity => {
            const store = this.newStore();
            store.entity = entity;
            return store;
        });
        return this._entityStores;
    }
    get hasEntities() { var _a; return !!((_a = this.entities) === null || _a === void 0 ? void 0 : _a.length); }
    get initialized() { return this.state !== 'uninitialized'; }
    get nullState() { return this.state === 'unfiltered' && !this.hasEntities; }
    get hasMore() { var _a; return ((_a = this.entities) === null || _a === void 0 ? void 0 : _a.length) < this.total; }
    get hasFilter() {
        const filters = Object.keys(this.filter);
        if (filters.length === 1 && filters[0] === '$sort')
            return false;
        return !!Object.keys(this.filter).length;
    }
    init() {
        var _a;
        super.init();
        if (this.service) {
            this.service.on('created', this.onCreated.bind(this));
            this.service.on('updated', this.onUpdated.bind(this));
            this.service.on('patched', this.onPatched.bind(this));
            this.service.on('removed', this.onDeleted.bind(this));
        }
        (_a = this.filterDisposer) === null || _a === void 0 ? void 0 : _a.call(this);
        this.filterDisposer = mobx_1.reaction(() => [this.skip, this.limit, this.filter], () => this.fetch(), { delay: 100 });
    }
    dispose() {
        var _a;
        (_a = this.filterDisposer) === null || _a === void 0 ? void 0 : _a.call(this);
        delete this.filterDisposer;
        for (const entityStore of this._entityStores)
            entityStore.dispose();
        super.dispose();
    }
    _preServiceRequest() {
        this.busy = true;
        this.clearErrors();
    }
    _postServiceRequest() {
        this.busy = false;
    }
    findIndex(entity) {
        return this.entities.findIndex(e => e._id === entity._id);
    }
    queryHook() { return {}; }
    getStore(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const store = this.entityStores.find(store => store.id === id) || this.newStore();
            if (store.hasEntity)
                return store;
            yield store.get(id);
            this.entities.push(store.entity);
            return store;
        });
    }
    newStore() {
        return __1.container.get(this.entityStoreSymbol);
    }
    reset() {
        this.limit = this.skip = this.total = unset;
        this.filter = {};
    }
    onCreated(entity) {
        mobx_1.runInAction(() => {
            const index = this.findIndex(entity);
            if (~index)
                this.entities[index] = entity;
            else {
                this.entities.push(entity);
                this.logger.info(`Instance ID ${this.instanceId} with service name "${this.serviceName}" created`, entity);
            }
        });
    }
    onUpdated(entity) {
        mobx_1.runInAction(() => {
            const index = this.findIndex(entity);
            if (~index) {
                this.entities[index] = entity;
                this.logger.info(`Instance ID ${this.instanceId} with service name "${this.serviceName}" updated`, entity);
            }
        });
    }
    onPatched(patch) {
        mobx_1.runInAction(() => {
            const index = this.findIndex(patch);
            if (~index) {
                const entity = this.entities[index];
                this.entities[index] = Object.assign(entity, patch);
                this.logger.info(`Instance ID ${this.instanceId} with service name "${this.serviceName}" patched`, patch);
            }
        });
    }
    onDeleted(entity) {
        mobx_1.runInAction(() => {
            const index = this.findIndex(entity);
            if (~index) {
                this.entities.splice(index, 1);
                this.logger.info(`Service name "${this.serviceName}" deleted`, entity);
            }
        });
    }
    next() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            this.disposeGuard();
            if (this.hasMore) {
                const skip = this.entities.length;
                const query = Object.assign(Object.assign(Object.assign(Object.assign({}, this.queryHook()), this.filter), (this.limit !== unset ? { $limit: this.limit } : undefined)), { $skip: skip });
                const result = yield this.service.find({ query });
                const data = result.data || result;
                this.entities.push(...data);
                this.saveQuery(query);
                this.logger.info(`Fetched next service name "${this.serviceName}" with Instance ID ${this.instanceId}`, this.lastQuery, result);
            }
        });
    }
    fetch(force = false) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            this.disposeGuard();
            try {
                this._preServiceRequest();
                const query = Object.assign(Object.assign(Object.assign(Object.assign({}, this.queryHook()), this.filter), (this.limit !== unset ? { $limit: this.limit } : undefined)), (this.skip !== unset ? { $skip: this.skip } : undefined));
                if (force || this.isDifferent(query)) {
                    const result = yield this.service.find({ query });
                    mobx_1.runInAction(() => {
                        this.total = result.total !== undefined ? result.total : unset;
                        this.entities = result.data || result;
                    });
                    this.saveQuery(query);
                    this.state = this.hasFilter ? 'filtered' : 'unfiltered';
                    this.logger.info(`Fetch ${this.serviceName} ${this.state} ${this.instanceId}`, this.lastQuery, result);
                }
                else {
                    this.logger.info(`SKIP Fetch ${this.serviceName} ${this.instanceId}`, this.lastQuery);
                }
            }
            catch (ex) {
                this.errors = ex;
                this.state = 'error';
                this.logger.error(`ERROR Fetch ${this.serviceName} ${this.instanceId}`, ex);
            }
            finally {
                this._postServiceRequest();
            }
        });
    }
    queryHash(query) {
        return JSON.stringify(mobx_1.toJS(Object.assign(Object.assign({}, query), { $limit: this.limit, $skip: this.skip })));
    }
    saveQuery(query) {
        this.lastQuery = this.queryHash(query);
    }
    isDifferent(query) {
        if (!this.lastQuery)
            return true;
        const queryHash = this.queryHash(query);
        return this.lastQuery !== queryHash;
    }
    filterEntityStores(filter) {
        if (this.hasEntities) {
            const stores = this.entityStores.filter(store => store[filter]);
            this.entities = stores.map(store => store.entity);
        }
    }
}
tslib_1.__decorate([
    mobx_1.observable,
    tslib_1.__metadata("design:type", Object)
], EntityListStore.prototype, "entities", void 0);
tslib_1.__decorate([
    mobx_1.observable,
    tslib_1.__metadata("design:type", Object)
], EntityListStore.prototype, "filter", void 0);
tslib_1.__decorate([
    mobx_1.observable,
    tslib_1.__metadata("design:type", Object)
], EntityListStore.prototype, "limit", void 0);
tslib_1.__decorate([
    mobx_1.observable,
    tslib_1.__metadata("design:type", __1.EntityStore)
], EntityListStore.prototype, "selectedStore", void 0);
tslib_1.__decorate([
    mobx_1.observable,
    tslib_1.__metadata("design:type", Object)
], EntityListStore.prototype, "skip", void 0);
tslib_1.__decorate([
    mobx_1.observable,
    tslib_1.__metadata("design:type", String)
], EntityListStore.prototype, "state", void 0);
tslib_1.__decorate([
    mobx_1.observable,
    tslib_1.__metadata("design:type", Object)
], EntityListStore.prototype, "total", void 0);
tslib_1.__decorate([
    mobx_1.computed,
    tslib_1.__metadata("design:type", Object),
    tslib_1.__metadata("design:paramtypes", [])
], EntityListStore.prototype, "entityStores", null);
tslib_1.__decorate([
    mobx_1.computed,
    tslib_1.__metadata("design:type", Object),
    tslib_1.__metadata("design:paramtypes", [])
], EntityListStore.prototype, "hasEntities", null);
tslib_1.__decorate([
    mobx_1.computed,
    tslib_1.__metadata("design:type", Object),
    tslib_1.__metadata("design:paramtypes", [])
], EntityListStore.prototype, "initialized", null);
tslib_1.__decorate([
    mobx_1.computed,
    tslib_1.__metadata("design:type", Object),
    tslib_1.__metadata("design:paramtypes", [])
], EntityListStore.prototype, "nullState", null);
tslib_1.__decorate([
    mobx_1.computed,
    tslib_1.__metadata("design:type", Object),
    tslib_1.__metadata("design:paramtypes", [])
], EntityListStore.prototype, "hasMore", null);
tslib_1.__decorate([
    mobx_1.computed,
    tslib_1.__metadata("design:type", Object),
    tslib_1.__metadata("design:paramtypes", [])
], EntityListStore.prototype, "hasFilter", null);
tslib_1.__decorate([
    mobx_1.action.bound,
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", void 0)
], EntityListStore.prototype, "reset", null);
tslib_1.__decorate([
    mobx_1.action.bound,
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], EntityListStore.prototype, "next", null);
tslib_1.__decorate([
    mobx_1.action.bound,
    tslib_1.__metadata("design:type", Object)
], EntityListStore.prototype, "monitor", void 0);
exports.EntityListStore = EntityListStore;
//# sourceMappingURL=entityList.js.map