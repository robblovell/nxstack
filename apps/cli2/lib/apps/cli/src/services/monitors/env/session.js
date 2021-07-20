"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnvSession = void 0;
const tslib_1 = require("tslib");
const fs_1 = require("fs");
const path_1 = tslib_1.__importDefault(require("path"));
const base_1 = require("../../base");
const session_1 = require("../../session");
const logger_1 = require("@c6o/logger");
const workload_1 = require("./workload");
const pathToChild = path_1.default.resolve(base_1.projectBaseDir, 'lib/services/monitors/env/child.js');
const debug = logger_1.createDebug();
class EnvSession extends session_1.ExternalService {
    get signature() { return `variables-${this.params.envFile}`; }
    sessionInProgress() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                yield fs_1.promises.access(this.params.envFile);
                return true;
            }
            catch (_a) {
                return yield this.session.any(EnvSession.cleanUpKeys);
            }
        });
    }
    performForeground() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            this.foregroundMonitor = new workload_1.WorkloadEnvMonitor(this.params);
            this.foregroundMonitor
                .start()
                .then(() => { debug('connected'); })
                .catch(err => debug('ERROR', err));
        });
    }
    performForegroundCleanup() {
        var _a;
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield ((_a = this.foregroundMonitor) === null || _a === void 0 ? void 0 : _a.stop());
            return true;
        });
    }
    performBackground() {
        const _super = Object.create(null, {
            wrapStatus: { get: () => super.wrapStatus },
            forker: { get: () => super.forker }
        });
        var _a, _b, _c, _d;
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (!this.params.envFile) {
                (_a = this.params.status) === null || _a === void 0 ? void 0 : _a.push(`Replicating environment from ${(_b = this.params.resourceQuery) === null || _b === void 0 ? void 0 : _b.metadata.name}`);
                (_c = this.params.status) === null || _c === void 0 ? void 0 : _c.pop(true);
                return;
            }
            const msg = `Replicating environment from ${(_d = this.params.resourceQuery) === null || _d === void 0 ? void 0 : _d.metadata.name} to ${this.params.envFile}`;
            return yield _super.wrapStatus.call(this, msg, _super.forker.call(this, pathToChild, false));
        });
    }
    cleanUpMessage() {
        var _a, _b;
        return this.params.envFile ?
            `Cleaning environment replication from ${(_a = this.params.resourceQuery) === null || _a === void 0 ? void 0 : _a.metadata.name} to ${this.params.envFile}` :
            `Environment replication from ${(_b = this.params.resourceQuery) === null || _b === void 0 ? void 0 : _b.metadata.name} skipped`;
    }
    onSpawn() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                const _a = this.params, { cluster, status } = _a, rest = tslib_1.__rest(_a, ["cluster", "status"]);
                debug('sending message');
                this.child.send(rest, (err) => err ? reject(err) : resolve());
            });
        });
    }
}
exports.EnvSession = EnvSession;
//# sourceMappingURL=session.js.map