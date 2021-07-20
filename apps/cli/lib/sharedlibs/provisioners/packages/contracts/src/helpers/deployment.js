"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeploymentHelper = void 0;
const codezero_1 = require("../codezero");
class DeploymentHelper extends codezero_1.CodeZeroHelper {
    static volumesPath() {
        return '/spec/template/spec/volumes';
    }
    static volumeMountsPath() {
        return '/spec/template/spec/containers/volumeMounts';
    }
    get templateSpec() {
        var _a, _b;
        return (_b = (_a = this.spec) === null || _a === void 0 ? void 0 : _a.template) === null || _b === void 0 ? void 0 : _b.spec;
    }
    get appName() {
        var _a;
        return (_a = this.metadata) === null || _a === void 0 ? void 0 : _a.ownerReferences[0].name;
    }
    get volumes() {
        var _a;
        return (_a = this.templateSpec) === null || _a === void 0 ? void 0 : _a.volumes;
    }
    get volumeMounts() {
        var _a, _b;
        return (_b = (_a = this.templateSpec) === null || _a === void 0 ? void 0 : _a.containers[0]) === null || _b === void 0 ? void 0 : _b.volumeMounts;
    }
    get volumesNotMounted() {
        var _a;
        return (_a = this.volumes) === null || _a === void 0 ? void 0 : _a.filter(volume => !this.volumeMounts.some(volumeMount => volume.name === volumeMount.name));
    }
}
exports.DeploymentHelper = DeploymentHelper;
DeploymentHelper.template = (namespace, name) => ({
    apiVersion: 'apps/v1',
    kind: 'Deployment',
    metadata: Object.assign(Object.assign({}, (name ? { name } : undefined)), (namespace ? { namespace } : undefined))
});
DeploymentHelper.from = (namespace, name) => new DeploymentHelper(DeploymentHelper.template(namespace, name));
//# sourceMappingURL=deployment.js.map