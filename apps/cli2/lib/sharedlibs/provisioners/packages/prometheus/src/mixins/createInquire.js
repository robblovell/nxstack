"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createInquireMixin = void 0;
const tslib_1 = require("tslib");
const inquirer_1 = tslib_1.__importDefault(require("inquirer"));
const createInquireMixin = (base) => class extends base {
    alertManagerEnabledProvided(answers) { return !!(this.spec.alertManagerEnabled || answers.alertManager); }
    kubeMetricsEnabledProvided(answers) { return !!(this.spec.kubeMetricsEnabled || answers.kubeMetrics); }
    nodeExporterEnabledProvided(answers) { return !!(this.spec.nodeExporterEnabled || answers.nodeExporter); }
    pushGatewayEnabledProvided(answers) { return !!(this.spec.simpleService || answers.simple); }
    createInquire(answers) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (!this.simpleServiceProvided(answers)) {
                const response = yield inquirer_1.default.prompt({
                    type: 'confirm',
                    name: 'simpleService',
                    default: false,
                    message: 'Provision simple prometheus service?',
                });
                this.spec.simpleService = (response === null || response === void 0 ? void 0 : response.simpleService) || false;
            }
            if (this.spec.simpleService)
                return;
            if (!this.alertManagerEnabledProvided(answers)) {
                const response = yield inquirer_1.default.prompt({
                    type: 'confirm',
                    name: 'alertManagerEnabled',
                    default: false,
                    message: 'Include alert manager?',
                });
                this.spec.alertManagerEnabled = (response === null || response === void 0 ? void 0 : response.alertManagerEnabled) || false;
            }
            if (!this.kubeMetricsEnabledProvided(answers)) {
                const response = yield inquirer_1.default.prompt({
                    type: 'confirm',
                    name: 'kubeMetricsEnabled',
                    default: false,
                    message: 'Include kube metrics?',
                });
                this.spec.kubeMetricsEnabled = (response === null || response === void 0 ? void 0 : response.kubeMetricsEnabled) || false;
            }
            if (!this.nodeExporterEnabledProvided(answers)) {
                const response = yield inquirer_1.default.prompt({
                    type: 'confirm',
                    name: 'nodeExporterEnabled',
                    default: false,
                    message: 'Include node exporter?',
                });
                this.spec.nodeExporterEnabled = (response === null || response === void 0 ? void 0 : response.nodeExporterEnabled) || false;
            }
            if (!this.pushGatewayEnabledProvided(answers)) {
                const response = yield inquirer_1.default.prompt({
                    type: 'confirm',
                    name: 'pushGatewayEnabled',
                    default: false,
                    message: 'Include push gateway?',
                });
                this.spec.pushGatewayEnabled = (response === null || response === void 0 ? void 0 : response.pushGatewayEnabled) || false;
            }
        });
    }
};
exports.createInquireMixin = createInquireMixin;
//# sourceMappingURL=createInquire.js.map