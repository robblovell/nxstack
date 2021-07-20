"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileSessionStorage = void 0;
const tslib_1 = require("tslib");
const logger_1 = require("@c6o/logger");
const proper_lockfile_1 = require("proper-lockfile");
const os_1 = require("os");
const promises_1 = tslib_1.__importDefault(require("fs/promises"));
const io_1 = require("./io");
const fs_extra_1 = tslib_1.__importDefault(require("fs-extra"));
const session_1 = require("../session");
const debug = logger_1.createDebug();
class FileSessionStorage {
    constructor(keySignature) {
        this.keySignature = keySignature;
        this._disposed = false;
        this.list = FileSessionStorage.list;
    }
    static get locksLocation() { return `${os_1.homedir()}/.codezero/locks/`; }
    get configFile() {
        return `${FileSessionStorage.locksLocation}${this.keySignature}.json`;
    }
    disposed() {
        return this._disposed;
    }
    exists() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                yield promises_1.default.access(this.configFile);
                return true;
            }
            catch (_a) {
                return false;
            }
        });
    }
    save(data) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            debug('save %o', data);
            yield promises_1.default.writeFile(this.configFile, JSON.stringify(data, null, 2));
            yield io_1.ensureOwner(this.configFile);
        });
    }
    create(data) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield this.save(data);
        });
    }
    load() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const data = yield promises_1.default.readFile(this.configFile, 'utf-8');
            return JSON.parse(data);
        });
    }
    static containerQuery() {
        return FileSessionStorage.locksLocation;
    }
    static list() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield FileSessionStorage.ensureLocksDir();
            const files = yield fs_extra_1.default.readdir(FileSessionStorage.locksLocation);
            const sessionFiles = files.filter(fn => fn.endsWith('.json'));
            const contentPromises = sessionFiles.map((file) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                const content = yield fs_extra_1.default.readJSON(FileSessionStorage.locksLocation + file);
                return content[session_1.Session.descriptionKey];
            }));
            const content = yield Promise.all(contentPromises);
            return content.filter(c => !!c);
        });
    }
    static subSessionList() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield FileSessionStorage.ensureLocksDir();
            const files = yield fs_extra_1.default.readdir(FileSessionStorage.locksLocation);
            const sessionFiles = files.filter(fn => fn.endsWith('.json'));
            const contentPromises = sessionFiles.map((file) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                const content = yield fs_extra_1.default.readJSON(FileSessionStorage.locksLocation + file);
                if (!content[session_1.Session.descriptionKey])
                    return file;
            }));
            const content = yield Promise.all(contentPromises);
            return content.filter(c => !!c);
        });
    }
    static purge() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield fs_extra_1.default.remove(FileSessionStorage.locksLocation);
        });
    }
    static ensureLocksDir() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield fs_extra_1.default.ensureDir(FileSessionStorage.locksLocation);
            yield io_1.ensureOwner(FileSessionStorage.locksLocation);
        });
    }
    ensure(data) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            debug('locks folder %s', FileSessionStorage.locksLocation);
            if (!(yield this.exists())) {
                yield FileSessionStorage.ensureLocksDir();
                if (data)
                    yield this.create(data);
                return true;
            }
            return false;
        });
    }
    lock() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (this._disposed)
                throw new Error('Attempt to lock when no lock exists');
            try {
                this.lockRelease = yield proper_lockfile_1.lock(this.configFile);
            }
            catch (error) {
                throw new Error('Attempt to use a locked resource.');
            }
        });
    }
    release() {
        var _a;
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (this._disposed)
                return;
            debug('freeing the lock: %s', this.configFile);
            yield ((_a = this.lockRelease) === null || _a === void 0 ? void 0 : _a.call(this));
        });
    }
    dispose() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                yield this.release();
                debug('calling unlink on: %s', this.configFile);
                yield promises_1.default.unlink(this.configFile);
                this._disposed = true;
            }
            catch (error) {
                debug('error: %o', error);
                throw error;
            }
        });
    }
}
exports.FileSessionStorage = FileSessionStorage;
//# sourceMappingURL=file.js.map