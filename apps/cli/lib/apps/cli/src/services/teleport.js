"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Teleport = void 0;
const tslib_1 = require("tslib");
const tunnels_1 = require("./tunnels");
const env_1 = require("./monitors/env/");
const session_1 = require("./session");
class Teleport extends session_1.CompositeService {
    toDescription() {
        var _a, _b;
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return {
                display: `Teleported to ${(_b = (_a = this.params.resourceQuery) === null || _a === void 0 ? void 0 : _a.metadata) === null || _b === void 0 ? void 0 : _b.name}`,
                cleanUpParams: {
                    namespace: this.params.namespace,
                    envFile: this.params.envFile,
                    resourceQuery: this.params.resourceQuery,
                }
            };
        });
    }
    execute() {
        var _a, _b, _c;
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const action = this.params.clean ? 'Closing' : 'Starting';
            const msg = `${action} teleport session for ${(_a = this.params.resourceQuery) === null || _a === void 0 ? void 0 : _a.kind} in ${(_c = (_b = this.params.namespaceResourceId) === null || _b === void 0 ? void 0 : _b.metadata) === null || _c === void 0 ? void 0 : _c.name}`;
            yield this.wrapStatus(msg, () => tslib_1.__awaiter(this, void 0, void 0, function* () {
                const monitor = new env_1.EnvSession(this.params);
                yield monitor.perform();
                this.registerForCleanup(monitor);
                const kubeFwd = new tunnels_1.KubefwdTuneller(this.params);
                yield kubeFwd.perform();
                this.registerForCleanup(kubeFwd);
            }));
        });
    }
}
exports.Teleport = Teleport;
//# sourceMappingURL=teleport.js.map