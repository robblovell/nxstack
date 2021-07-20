"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loggerApiMixin = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@provisioner/common");
const debug_1 = tslib_1.__importDefault(require("debug"));
const debug = debug_1.default('c6o-system:logger:');
const loggerApiMixin = (base) => class extends base {
    systemServerConfigMap(serviceNamespace) {
        return {
            kind: 'ConfigMap',
            metadata: {
                namespace: serviceNamespace,
                name: 'system-server-config'
            }
        };
    }
    linkLogger(serviceNamespace, appNamespace, appId) {
        var _a, _b, _c;
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const app = yield common_1.AppHelper.from(appNamespace, appId).read(this.controller.cluster, `Failed to find ${appId} in ${appNamespace}`);
            if (!((_a = app.spec.services) === null || _a === void 0 ? void 0 : _a.logstash)) {
                debug(`Unable to find logstash services for App ${appNamespace}.${appId}`);
                (_b = this.logger) === null || _b === void 0 ? void 0 : _b.warn(`Unable to find logstash services for App ${appNamespace}.${appId}`);
                return;
            }
            const logstash = app.spec.services.logstash;
            const result = yield this.controller.cluster.read(this.systemServerConfigMap(serviceNamespace));
            if (result.error) {
                debug(result.error);
                (_c = this.logger) === null || _c === void 0 ? void 0 : _c.error(result.error);
                throw result.error;
            }
            const systemServerConfigMap = result.as();
            systemServerConfigMap.data = Object.assign({ LOG_ELASTIC_CONNECTION: `${logstash.protocol}://${logstash.service}.${appNamespace}:${logstash.port}`, LOG_LEVEL: 'info' }, systemServerConfigMap.data);
            yield this.controller.cluster.upsert(systemServerConfigMap);
            yield this.restartSystemServer(serviceNamespace);
        });
    }
    unlinkLogger(serviceNamespace) {
        var _a;
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const result = yield this.controller.cluster.read(this.systemServerConfigMap(serviceNamespace));
            if (result.error) {
                debug(result.error);
                (_a = this.logger) === null || _a === void 0 ? void 0 : _a.error(result.error);
                throw result.error;
            }
            const systemServerConfigMap = result.as();
            systemServerConfigMap.data.LOG_ELASTIC_CONNECTION = null;
            yield this.controller.cluster.patch(systemServerConfigMap, { data: systemServerConfigMap.data });
            yield this.restartSystemServer(serviceNamespace);
        });
    }
};
exports.loggerApiMixin = loggerApiMixin;
//# sourceMappingURL=logger.js.map