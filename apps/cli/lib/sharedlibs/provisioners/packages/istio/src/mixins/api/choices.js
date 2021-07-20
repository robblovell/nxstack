"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.choicesApiMixin = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@provisioner/common");
const choicesApiMixin = (base) => class extends base {
    constructor() {
        super(...arguments);
        this['choices'] = {
            find: () => tslib_1.__awaiter(this, void 0, void 0, function* () {
                let apps = yield common_1.AppHelper.from(null, 'grafana').list(this.controller.cluster, 'Failed to find Grafana');
                const grafanaOptions = apps.map(app => app.metadata.namespace) || [];
                apps = yield common_1.AppHelper.from(null, 'prometheus').list(this.controller.cluster, 'Failed to find Prometheus');
                const prometheusOptions = apps.map(app => app.metadata.namespace) || [];
                return {
                    grafanaOptions,
                    prometheusOptions
                };
            })
        };
    }
};
exports.choicesApiMixin = choicesApiMixin;
//# sourceMappingURL=choices.js.map