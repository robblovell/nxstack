"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SecretEnvMonitor = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@provisioner/common");
const base_1 = require("./base");
class SecretEnvMonitor extends base_1.EnvMonitor {
    onAdded() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            this.envValues = common_1.SecretHelper.toKeyValues(this.current);
            return true;
        });
    }
    onModified() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            this.envValues = common_1.SecretHelper.toKeyValues(this.current);
            return true;
        });
    }
}
exports.SecretEnvMonitor = SecretEnvMonitor;
//# sourceMappingURL=secret.js.map