"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Session = void 0;
const tslib_1 = require("tslib");
const logger_1 = require("@c6o/logger");
const object_hash_1 = tslib_1.__importDefault(require("object-hash"));
const file_1 = require("./storage/file");
const cluster_1 = require("./storage/cluster");
const debug = logger_1.createDebug();
const isFileStorage = (storage) => {
    return typeof storage.list === 'function';
};
class Session {
    constructor(signature, lockStorage) {
        this.signature = signature;
        this.lockStorage = lockStorage;
        this.config = {};
        this.setDescription = (value) => tslib_1.__awaiter(this, void 0, void 0, function* () { return yield this.set(Session.descriptionKey, value); });
        this.lockStorage = this.lockStorage || new file_1.FileSessionStorage(this.signatureHash);
    }
    get signatureHash() {
        if (this._signatureHash)
            return this._signatureHash;
        return this._signatureHash = object_hash_1.default(this.signature);
    }
    static subSessionList(options) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return [
                ...yield file_1.FileSessionStorage.subSessionList(),
                ...yield cluster_1.ClusterSessionStorage.subSessionList(options)
            ];
        });
    }
    static purge(options) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            debug('purge %o', options);
            yield file_1.FileSessionStorage.purge();
        });
    }
    dependantCount() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let count = 0;
            if (isFileStorage(this.lockStorage)) {
                const sessions = yield this.lockStorage.list();
                for (const session of sessions) {
                    if (session.signatures.includes(this.signature))
                        count++;
                }
            }
            return count;
        });
    }
    ensureAlive() {
        if (this.lockStorage.disposed())
            throw new Error('Attempt to use a disposed session');
    }
    lock() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            this.ensureAlive();
            const storageIsNew = yield this.lockStorage.ensure(this.config);
            yield this.lockStorage.lock();
            this.config = yield this.lockStorage.load();
            return storageIsNew;
        });
    }
    release() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield this.lockStorage.release();
            debug('released session %s', this.signature);
        });
    }
    dispose() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            this.ensureAlive();
            yield this.lockStorage.dispose();
            debug('disposed session %s', this.signature);
        });
    }
    any(items) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            this.ensureAlive();
            const keys = Object.keys(this.config);
            return !!keys.length && keys.some(a => items.includes(a));
        });
    }
    set(key, value) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            this.ensureAlive();
            this.config[key] = value;
            yield this.lockStorage.save(this.config);
        });
    }
    get(key) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            this.ensureAlive();
            return yield this.config[key];
        });
    }
    remove(key) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            this.ensureAlive();
            delete this.config[key];
            yield this.lockStorage.save(this.config);
        });
    }
}
exports.Session = Session;
Session.descriptionKey = 'session-description';
//# sourceMappingURL=session.js.map