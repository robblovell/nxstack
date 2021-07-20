"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigMapEnvMonitor = void 0;
const tslib_1 = require("tslib");
const logger_1 = require("@c6o/logger");
const common_1 = require("@provisioner/common");
const base_1 = require("./base");
const debug = logger_1.createDebug();
class ConfigMapEnvMonitor extends base_1.EnvMonitor {
    onAdded() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            debug('added cm %o', this.current);
            this.envValues = common_1.ConfigMapHelper.toKeyValues(this.current);
            return true;
        });
    }
    onModified() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            debug('modified cm %o', this.current);
            this.envValues = common_1.ConfigMapHelper.toKeyValues(this.current);
            return true;
        });
    }
}
exports.ConfigMapEnvMonitor = ConfigMapEnvMonitor;
//# sourceMappingURL=configMap.js.map