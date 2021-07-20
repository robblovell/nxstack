"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeApplyMixin = void 0;
const tslib_1 = require("tslib");
const removeApplyMixin = (base) => class extends base {
    removeApply() {
        var _a, _b, _c;
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const namespace = this.controller.resource.metadata.namespace;
            const result = yield this.controller.cluster.list(this.dashboardConfigMap(namespace));
            let hasDashboards = false;
            let configMaps = [];
            if (!result.error) {
                hasDashboards = ((_b = (_a = result.object) === null || _a === void 0 ? void 0 : _a.items) === null || _b === void 0 ? void 0 : _b.length) ? true : false;
                configMaps = (_c = result.object) === null || _c === void 0 ? void 0 : _c.items;
            }
            if (hasDashboards && !this.providedDeprovisionOption('force'))
                throw Error('dashboards exist, use force option to remove');
            for (const configMap of configMaps) {
                configMap.kind = 'ConfigMap';
                yield this.controller.cluster.delete(configMap);
            }
            yield this.controller.cluster
                .begin('Uninstall Grafana services')
                .deleteFile('../../k8s/pvc.yaml', { namespace })
                .deleteFile('../../k8s/deployment.yaml', { namespace, adminUsername: 'dummy', adminPassword: 'dummy' })
                .deleteFile('../../k8s/service.yaml', { namespace })
                .end();
        });
    }
};
exports.removeApplyMixin = removeApplyMixin;
//# sourceMappingURL=removeApply.js.map