"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExternalService = void 0;
const tslib_1 = require("tslib");
const logger_1 = require("@c6o/logger");
const child_process_1 = require("child_process");
const service_1 = require("./service");
const semver = tslib_1.__importStar(require("semver"));
const debug = logger_1.createDebug();
class ExternalService extends service_1.SessionService {
    cleanUpMessage(hasDependant) {
        return hasDependant ?
            `Leaving service ${this.constructor.name} untouched` :
            `Cleaning up service ${this.constructor.name}`;
    }
    sessionInProgress() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.session.any(ExternalService.cleanUpKeys);
        });
    }
    executeCleanup() {
        const _super = Object.create(null, {
            wrapStatus: { get: () => super.wrapStatus }
        });
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const hasDependant = (yield this.session.dependantCount()) > 1;
            return yield _super.wrapStatus.call(this, this.cleanUpMessage(hasDependant), () => tslib_1.__awaiter(this, void 0, void 0, function* () {
                if (hasDependant)
                    return false;
                const pid = yield this.session.get('child-pid');
                if (pid) {
                    try {
                        debug('cleaning pid %d', pid);
                        const success = process.kill(pid);
                        debug('cleaning pid %d result %o', pid, success);
                    }
                    catch (err) {
                    }
                }
                return yield this.performForegroundCleanup();
            }));
        });
    }
    performBackground() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            throw new Error('performBackground not overridden');
        });
    }
    performForeground() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            throw new Error('performForeground not overridden');
        });
    }
    performForegroundCleanup() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return true;
        });
    }
    performBackgroundWrapper() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const warningTimer = setTimeout(() => {
                debug('Child has not resolved within 5 seconds');
            }, 5000);
            const timer = setTimeout(() => { null; }, 999999);
            try {
                yield this.performBackground();
            }
            finally {
                clearTimeout(timer);
                clearTimeout(warningTimer);
            }
        });
    }
    execute() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (this.params.wait)
                yield this.performForeground();
            else
                yield this.performBackgroundWrapper();
        });
    }
    spawner(command, awaitMessage, ...args) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (this.child)
                throw Error('Child has already been spawned');
            return new Promise((resolve, reject) => {
                this.child = child_process_1.spawn(command, args, {
                    env: process.env,
                    detached: true,
                    stdio: 'ignore'
                });
                this.onChildCreated(awaitMessage, resolve, reject);
            });
        });
    }
    forker(pathToChild, awaitMessage, ...args) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (this.child)
                throw Error('Child has already been spawned');
            return new Promise((resolve, reject) => {
                this.child = child_process_1.fork(pathToChild, args, {
                    detached: true,
                    stdio: 'inherit'
                });
                this.onChildCreated(awaitMessage, resolve, reject);
            });
        });
    }
    onChildCreated(awaitMessage, resolve, reject) {
        const onSpawn = () => tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield this.session.set('child-pid', this.child.pid);
            yield this.onSpawn();
            if (!awaitMessage) {
                this.detach();
                resolve();
            }
        });
        if (semver.gte(process.version, '14.17.0')) {
            this.child.on('spawn', onSpawn);
        }
        else {
            setTimeout(onSpawn, 500);
        }
        this.child.on('message', (args) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (args.error) {
                this.detach();
                reject(args.error);
            }
            else {
                yield this.onMessage(args);
                if (awaitMessage) {
                    this.detach();
                    resolve();
                }
            }
        }));
        this.child.on('error', (err) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            debug('ERROR from child %o', err);
            this.detach();
            reject(new Error('Child experienced an error'));
        }));
        this.child.on('exit', (_) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            debug('exit child');
            reject(new Error('Child exited unexpectedly'));
        }));
    }
    onSpawn() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            debug('spawner spawned successfully');
        });
    }
    onMessage(msg) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            debug('Message received %o', msg);
        });
    }
    detach() {
        var _a, _b;
        (_b = (_a = this.child).disconnect) === null || _b === void 0 ? void 0 : _b.call(_a);
        this.child.unref();
    }
}
exports.ExternalService = ExternalService;
ExternalService.cleanUpKeys = ['child-pid'];
//# sourceMappingURL=external.js.map