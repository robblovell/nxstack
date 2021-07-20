"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.npmApiMixin = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@provisioner/common");
const debug_1 = tslib_1.__importDefault(require("debug"));
const debug = debug_1.default('c6o-system:npmApiMixin:');
const npmApiMixin = (base) => class extends base {
    systemServerSecrets(serviceNamespace) {
        return {
            kind: 'Secret',
            metadata: {
                namespace: serviceNamespace,
                name: 'system-server-secrets'
            }
        };
    }
    linkNpm(serviceNamespace) {
        var _a, _b, _c, _d;
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const npmLink = this.spec['npm-link'];
            this.controller.resource.spec.provisioner['npm-link'] = npmLink.name ? { name: npmLink.name } : { url: npmLink.url };
            let registryUrl;
            if (npmLink.name) {
                const appIdParts = npmLink.name.split('/');
                const appNamespace = appIdParts[0];
                const appId = appIdParts[1];
                const app = yield common_1.AppHelper.from(appNamespace, appId).read(this.controller.cluster, `Failed to find ${appId} in ${appNamespace}`);
                const npmRegistry = app.spec.services['npm-registry'];
                if (!((_a = app.spec.services) === null || _a === void 0 ? void 0 : _a['npm-registry'])) {
                    debug(`Unable to find npm-registry service for app ${appNamespace}.${appId}`);
                    (_b = this.logger) === null || _b === void 0 ? void 0 : _b.warn(`Unable to find npm-registry service for App ${appNamespace}.${appId}`);
                    return;
                }
                registryUrl = `${npmRegistry.protocol}://${npmRegistry.service}.${appNamespace}${npmRegistry.port !== 80 ? `:${npmRegistry.port}` : ''}`;
            }
            else
                registryUrl = npmLink.url;
            let result = yield this.controller.cluster.read(this.systemServerConfigMap(serviceNamespace));
            if (result.error) {
                debug(result.error);
                (_c = this.logger) === null || _c === void 0 ? void 0 : _c.error(result.error);
                throw result.error;
            }
            const systemServerConfigMap = result.as();
            systemServerConfigMap.data = { NPM_REGISTRY_URL: registryUrl };
            yield this.controller.cluster.upsert(systemServerConfigMap);
            if (npmLink.username && npmLink.password) {
                result = yield this.controller.cluster.read(this.systemServerSecrets(serviceNamespace));
                if (result.error) {
                    debug(result.error);
                    (_d = this.logger) === null || _d === void 0 ? void 0 : _d.error(result.error);
                    throw result.error;
                }
                const systemServerSecrets = result.as();
                systemServerSecrets.data = Object.assign(Object.assign({}, systemServerSecrets.data), { NPM_REGISTRY_USERNAME: npmLink.username, NPM_REGISTRY_PASSWORD: npmLink.password });
                yield this.controller.cluster.upsert(systemServerSecrets);
            }
            yield this.restartSystemServer(serviceNamespace);
        });
    }
    unlinkNpm(serviceNamespace) {
        var _a, _b;
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let result = yield this.controller.cluster.read(this.systemServerConfigMap(serviceNamespace));
            if (result.error) {
                debug(result.error);
                (_a = this.logger) === null || _a === void 0 ? void 0 : _a.error(result.error);
                throw result.error;
            }
            const systemServerConfigMap = result.as();
            systemServerConfigMap.data.NPM_REGISTRY_URL = null;
            yield this.controller.cluster.upsert(systemServerConfigMap);
            result = yield this.controller.cluster.read(this.systemServerSecrets(serviceNamespace));
            if (result.error) {
                debug(result.error);
                (_b = this.logger) === null || _b === void 0 ? void 0 : _b.error(result.error);
                throw result.error;
            }
            const systemServerSecrets = result.as();
            if (systemServerSecrets.data) {
                systemServerSecrets.data.NPM_REGISTRY_USERNAME = null;
                systemServerSecrets.data.NPM_REGISTRY_PASSWORD = null;
            }
            yield this.controller.cluster.upsert(systemServerSecrets);
            yield this.restartSystemServer(serviceNamespace);
        });
    }
};
exports.npmApiMixin = npmApiMixin;
//# sourceMappingURL=npm.js.map