"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Monitor = void 0;
const tslib_1 = require("tslib");
const logger_1 = require("@c6o/logger");
const base_1 = require("../base");
const debug = logger_1.createDebug();
class Monitor extends base_1.Service {
    constructor() {
        super(...arguments);
        this.children = new Map();
        this.watchDone = (error) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            if ((error === null || error === void 0 ? void 0 : error.code) === 'ECONNRESET')
                error = null;
            debug('watch done for %o', this.params.resourceQuery);
            this.watcher = null;
            yield this.stop();
        });
        this.watchCallback = (operation, resource) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (this.stopped)
                return;
            switch (operation) {
                case 'ADDED':
                    yield this.processAdded(resource);
                    break;
                case 'MODIFIED':
                    yield this.processModified(resource);
                    break;
                case 'REMOVED':
                    yield this.processRemoved(resource);
                    break;
            }
        });
        this.debouncedRefresh = this.debounce(this.refresh);
    }
    start() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (this.watcher)
                return;
            this.key = Monitor.toKey(this.params.resourceQuery);
            debug('starting %s', this.key);
            const result = yield this.params.cluster.watch(this.params.resourceQuery, this.watchCallback, this.watchDone);
            result.throwIfError();
            this.watcher = result.otherAs();
        });
    }
    stop() {
        var _a;
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            this.stopped = true;
            (_a = this.watcher) === null || _a === void 0 ? void 0 : _a.disposer();
            this.watcher = null;
            for (const [, child] of this.children.entries())
                yield child.stop();
            this.children.clear();
        });
    }
    debounce(func, timeout = this.params.debounce || 300) {
        let timer;
        return (...args) => {
            clearTimeout(timer);
            timer = setTimeout(() => { func.apply(this, args); }, timeout);
        };
    }
    processRefresh() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (this.parent)
                return yield this.parent.processRefresh();
            yield this.debouncedRefresh();
        });
    }
    *each() {
        for (const [, child] of this.children.entries())
            yield* child.each();
        yield this;
    }
    refresh() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            debug('refresh %s %d', this.key, this.children.size);
        });
    }
    onAdded() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            debug('added %s %o %d', this.key, this.current, this.children.size);
            return true;
        });
    }
    onModified() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            debug('modified %s %o %d', this.key, this.current, this.children.size);
            return true;
        });
    }
    monitorFactory(resource) {
        throw new Error(`Monitor Factory not implemented for ${resource.kind}`);
    }
    addChild(resource, key) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            key = key || Monitor.toKey(resource);
            const child = this.children.get(key);
            debug('child %s %o', key, child);
            if (!child) {
                debug('adding child %s %o', key, resource);
                const factory = this.monitorFactory(resource);
                const newChild = new factory(Object.assign(Object.assign({}, this.params), { resourceQuery: resource }));
                newChild.parent = this;
                this.children.set(key, newChild);
                yield newChild.start();
            }
        });
    }
    removeChild(key, deferRefresh = false) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const child = this.children.get(key);
            if (child) {
                debug('removing child %s %o', key, child.current);
                yield child.stop();
                this.children.delete(key);
                if (!deferRefresh)
                    yield this.processRefresh();
            }
        });
    }
    reload(...resources) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const keys = [];
            let hasAdditions = false;
            for (const resource of resources) {
                const key = Monitor.toKey(resource);
                if (!this.children.has(key)) {
                    yield this.addChild(resource, key);
                    hasAdditions = true;
                }
                keys.push(key);
            }
            const currentChildren = Array.from(this.children.keys());
            const toBeDeleted = currentChildren.filter(key => !keys.includes(key));
            for (const key of toBeDeleted)
                yield this.removeChild(key, true);
            debug('reloaded %o %o', hasAdditions, toBeDeleted, currentChildren);
            return hasAdditions || !!toBeDeleted.length;
        });
    }
    processAdded(resource) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const key = Monitor.toKey(resource);
            if (key !== this.key)
                return yield this.addChild(resource, key);
            this.current = resource;
            if (yield this.onAdded())
                yield this.processRefresh();
        });
    }
    processModified(resource) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const key = Monitor.toKey(resource);
            if (key !== this.key)
                return;
            this.current = resource;
            if (yield this.onModified())
                yield this.processRefresh();
        });
    }
    processRemoved(resource) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const key = Monitor.toKey(resource);
            if (key !== this.key)
                return;
            if (this.parent)
                yield this.parent.removeChild(key);
            else
                yield this.stop();
        });
    }
    static toKey(resource) {
        var _a, _b;
        if (!resource.kind ||
            !((_a = resource.metadata) === null || _a === void 0 ? void 0 : _a.namespace) ||
            !((_b = resource.metadata) === null || _b === void 0 ? void 0 : _b.name))
            return 'root-query';
        return [
            resource.kind,
            resource.metadata.namespace,
            resource.metadata.name
        ].join('-');
    }
}
exports.Monitor = Monitor;
//# sourceMappingURL=base.js.map