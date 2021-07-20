"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateApplyMixin = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@provisioner/common");
const constants_1 = require("../constants");
const debug_1 = tslib_1.__importDefault(require("debug"));
const debug = debug_1.default('c6o-system:updateApply:');
const updateApplyMixin = (base) => class extends base {
    constructor() {
        super(...arguments);
        this.restartSystemServer = (serviceNamespace) => tslib_1.__awaiter(this, void 0, void 0, function* () { return yield common_1.DeploymentHelper.from(serviceNamespace, 'system-server').restart(this.controller.cluster); });
    }
    updateNpm(serviceNamespace) {
        var _a, _b, _c, _d;
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const newLink = this.spec['npm-link'];
            if (newLink === constants_1.unlinkToken) {
                (_a = this.controller.status) === null || _a === void 0 ? void 0 : _a.push('Unlinking system from npm registry');
                yield this.unlinkNpm(serviceNamespace);
                (_b = this.controller.status) === null || _b === void 0 ? void 0 : _b.pop();
                return true;
            }
            else if (newLink) {
                (_c = this.controller.status) === null || _c === void 0 ? void 0 : _c.push(`Linking system to npm at ${newLink.name}`);
                yield this.linkNpm(serviceNamespace);
                (_d = this.controller.status) === null || _d === void 0 ? void 0 : _d.pop();
                return true;
            }
        });
    }
    updateLogger(serviceNamespace) {
        var _a, _b, _c, _d;
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const newLink = this.spec['logging-link'];
            if (newLink === constants_1.unlinkToken) {
                (_a = this.controller.status) === null || _a === void 0 ? void 0 : _a.push('Unlinking system from logger');
                yield this.unlinkLogger(serviceNamespace);
                (_b = this.controller.status) === null || _b === void 0 ? void 0 : _b.pop();
                return true;
            }
            else if (newLink) {
                const appNamespace = this.spec['logging-link'].split('/')[0];
                const appId = this.spec['logging-link'].split('/')[1];
                (_c = this.controller.status) === null || _c === void 0 ? void 0 : _c.push(`Linking system to logger in namespace ${appNamespace} for app ${appId}`);
                yield this.linkLogger(serviceNamespace, appNamespace, appId);
                (_d = this.controller.status) === null || _d === void 0 ? void 0 : _d.pop();
                return true;
            }
        });
    }
    updateGrafana(serviceNamespace) {
        var _a, _b, _c, _d;
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const newLink = this.spec['grafana-link'];
            if (newLink === constants_1.unlinkToken) {
                (_a = this.controller.status) === null || _a === void 0 ? void 0 : _a.push('Unlinking system from grafana');
                yield this.unlinkGrafana(serviceNamespace);
                (_b = this.controller.status) === null || _b === void 0 ? void 0 : _b.pop();
                return true;
            }
            else if (newLink) {
                const appNamespace = this.spec['grafana-link'];
                (_c = this.controller.status) === null || _c === void 0 ? void 0 : _c.push(`Linking system to grafana in namespace ${appNamespace}`);
                yield this.linkGrafana(appNamespace, serviceNamespace);
                (_d = this.controller.status) === null || _d === void 0 ? void 0 : _d.pop();
                return true;
            }
        });
    }
    updateApply() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const serviceNamespace = this.controller.resource.metadata.namespace;
            let restartRequired = yield this.updateNpm(serviceNamespace);
            restartRequired = (yield this.updateLogger(serviceNamespace)) || restartRequired;
            restartRequired = (yield this.updateGrafana(serviceNamespace)) || restartRequired;
            yield this.updateSystem();
            if (restartRequired)
                yield this.restartSystemServer(serviceNamespace);
        });
    }
};
exports.updateApplyMixin = updateApplyMixin;
//# sourceMappingURL=updateApply.js.map