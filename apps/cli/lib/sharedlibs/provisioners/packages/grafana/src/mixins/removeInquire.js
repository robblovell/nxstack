"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeInquireMixin = void 0;
const tslib_1 = require("tslib");
const inquirer_1 = tslib_1.__importDefault(require("inquirer"));
const removeInquireMixin = (base) => class extends base {
    dashboardConfigMap(namespace) {
        return {
            kind: 'ConfigMap',
            metadata: {
                namespace,
                labels: {
                    'system.codezero.io/managed-by': 'grafana'
                }
            }
        };
    }
    removeInquire(answers) {
        const _super = Object.create(null, {
            providedDeprovisionOption: { get: () => super.providedDeprovisionOption },
            setDeprovisionOption: { get: () => super.setDeprovisionOption },
            getDeprovisionOption: { get: () => super.getDeprovisionOption }
        });
        var _a, _b;
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const namespace = this.controller.resource.metadata.namespace;
            const result = yield this.controller.cluster.list(this.dashboardConfigMap(namespace));
            let hasDashboards = false;
            if (!result.error)
                hasDashboards = ((_b = (_a = result.object) === null || _a === void 0 ? void 0 : _a.items) === null || _b === void 0 ? void 0 : _b.length) ? true : false;
            if (hasDashboards && !_super.providedDeprovisionOption.call(this, 'force', answers)) {
                const response = yield inquirer_1.default.prompt({
                    type: 'confirm',
                    name: 'force',
                    default: false,
                    message: 'You have dashboards added by another application, force deprovisioning?',
                });
                if (response)
                    _super.setDeprovisionOption.call(this, 'force', response.force);
            }
            else
                _super.setDeprovisionOption.call(this, 'force', _super.getDeprovisionOption.call(this, 'force', false, answers));
        });
    }
};
exports.removeInquireMixin = removeInquireMixin;
//# sourceMappingURL=removeInquire.js.map