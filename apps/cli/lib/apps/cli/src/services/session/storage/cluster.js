"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClusterSessionStorage = void 0;
const tslib_1 = require("tslib");
const logger_1 = require("@c6o/logger");
const helper_1 = require("./helper");
const kits_1 = require("@c6o/kits");
const debug = logger_1.createDebug();
const ClusterSessionDefaultNamespace = 'default';
class ClusterSessionStorage {
    constructor(keySignature, options) {
        this.keySignature = keySignature;
        this._disposed = false;
        this.namespace = options.namespace || ClusterSessionDefaultNamespace;
        this.cluster = options.cluster;
    }
    static get locksLocation() { return 'sessions.system.codezero.io'; }
    sessionHelper() {
        return helper_1.SessionHelper.from(this.namespace, this.keySignature);
    }
    disposed() {
        return this._disposed;
    }
    ensureContainer() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const helper = new kits_1.EnvironmentNamespaceHelper();
            try {
                return yield helper.get(this.cluster, this.namespace);
            }
            catch (_a) {
                return yield helper.create(this.cluster, this.namespace);
            }
        });
    }
    save(data) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            debug(`Save: ${data}`);
            const sessionHelper = this.sessionHelper();
            const patch = [{
                    op: 'replace',
                    path: '/spec',
                    value: data
                }];
            const result = yield this.cluster.patch(sessionHelper.resource, patch);
            result.throwIfError();
        });
    }
    create(data) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const sessionHelper = this.sessionHelper();
            sessionHelper.resource.spec = data;
            const result = yield this.cluster.create(sessionHelper.resource);
            result.throwIfError();
        });
    }
    load() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const sessionHelper = this.sessionHelper();
            const result = yield this.cluster.read(sessionHelper.resource);
            result.throwIfError();
            const session = result.as();
            return session.spec || {};
        });
    }
    static list(options) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield helper_1.SessionHelper.ensureCRD(options.cluster);
            const resource = yield helper_1.SessionHelper.from(options.namespace).resource;
            const result = yield options.cluster.list(resource);
            result.throwIfError();
            return Array.from(result.each('Session'));
        });
    }
    static subSessionList(options) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield helper_1.SessionHelper.ensureCRD(options.cluster);
            const sessions = yield ClusterSessionStorage.list(options);
            return sessions.map(session => session.metadata.name);
        });
    }
    static purge(options) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield helper_1.SessionHelper.ensureCRD(options.cluster);
            const result = yield options.cluster.delete(helper_1.SessionHelper.from(options.namespace).resource);
            result.throwIfError();
        });
    }
    ensure(data) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            debug('locks resource %s', ClusterSessionStorage.locksLocation);
            yield helper_1.SessionHelper.ensureCRD(this.cluster);
            const sessionHelper = this.sessionHelper();
            if (!(yield sessionHelper.exists(this.cluster))) {
                yield this.ensureContainer();
                yield this.create(data);
                return true;
            }
            return false;
        });
    }
    lock() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (this._disposed)
                throw new Error('Attempt a remote lock when no lock exists');
            try {
                const sessionHelper = this.sessionHelper();
                debug('Locking the remote resource: %o', sessionHelper.resource);
                yield sessionHelper.beginTransaction(this.cluster);
            }
            catch (error) {
                throw new Error('Attempt to use a locked resource.');
            }
        });
    }
    release() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                if (this._disposed)
                    return;
                const sessionHelper = this.sessionHelper();
                debug('freeing the remote lock: %o', sessionHelper.resource);
                yield sessionHelper.endTransaction(this.cluster);
            }
            catch (error) {
                debug('release error: ', error);
                throw error;
            }
        });
    }
    dispose() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                yield this.release();
                const sessionHelper = this.sessionHelper();
                debug('calling delete on: %o', sessionHelper.resource);
                yield this.cluster.delete(sessionHelper.resource);
                this._disposed = true;
            }
            catch (error) {
                debug('dispose error: %o', error);
                throw error;
            }
        });
    }
}
exports.ClusterSessionStorage = ClusterSessionStorage;
//# sourceMappingURL=cluster.js.map