"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateApplyMixin = void 0;
const tslib_1 = require("tslib");
const constants_1 = require("../constants");
const updateApplyMixin = (base) => class extends base {
    updatePrometheus(serviceNamespace) {
        var _a, _b, _c, _d;
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const newPrometheusLink = this.spec['prometheus-link'];
            if (newPrometheusLink === constants_1.unlinkToken) {
                (_a = this.controller.status) === null || _a === void 0 ? void 0 : _a.push('Unlinking istio from Prometheus');
                yield this.unlinkPrometheus(serviceNamespace);
                (_b = this.controller.status) === null || _b === void 0 ? void 0 : _b.pop();
            }
            else if (newPrometheusLink) {
                (_c = this.controller.status) === null || _c === void 0 ? void 0 : _c.push(`Linking istio to Prometheus in namespace ${newPrometheusLink}`);
                yield this.linkPrometheus(newPrometheusLink, serviceNamespace);
                (_d = this.controller.status) === null || _d === void 0 ? void 0 : _d.pop();
            }
        });
    }
    updateGrafana(serviceNamespace) {
        var _a, _b, _c, _d;
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const newGrafanaLink = this.spec['grafana-link'];
            if (newGrafanaLink === constants_1.unlinkToken) {
                (_a = this.controller.status) === null || _a === void 0 ? void 0 : _a.push('Unlinking istio from Grafana');
                yield this.unlinkGrafana(serviceNamespace);
                (_b = this.controller.status) === null || _b === void 0 ? void 0 : _b.pop();
            }
            else if (newGrafanaLink) {
                (_c = this.controller.status) === null || _c === void 0 ? void 0 : _c.push(`Linking istio to Grafana in namespace ${newGrafanaLink}`);
                yield this.linkGrafana(newGrafanaLink, serviceNamespace);
                (_d = this.controller.status) === null || _d === void 0 ? void 0 : _d.pop();
            }
        });
    }
    updateApply() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const serviceNamespace = this.controller.resource.metadata.namespace;
            yield this.updatePrometheus(serviceNamespace);
            yield this.updateGrafana(serviceNamespace);
            const newHttpsRedirect = !!this.spec.httpsRedirect;
            yield this.setHttpsRedirect(newHttpsRedirect);
        });
    }
};
exports.updateApplyMixin = updateApplyMixin;
//# sourceMappingURL=updateApply.js.map