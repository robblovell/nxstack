"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrometheusMainInstall = void 0;
const tslib_1 = require("tslib");
const lit_element_1 = require("lit-element");
let PrometheusMainInstall = class PrometheusMainInstall extends lit_element_1.LitElement {
    constructor() {
        super(...arguments);
        this.isSimple = false;
        this.checkHandler = (field) => (e) => {
            this.serviceSpec[field] = e.detail.value;
            this.isSimple = this.serviceSpec.simpleService;
        };
    }
    get serviceSpec() {
        return this.mediator.getServiceSpec('prometheus');
    }
    render() {
        return lit_element_1.html `
            <c6o-form-layout>
                <c6o-checkbox
                    ?checked=${!!this.serviceSpec.simpleService}
                    theme="condensed"
                    @checked-changed=${this.checkHandler('simpleService')}
                >
                    Simple Prometheus Install
                </c6o-checkbox>
                <c6o-checkbox
                    ?checked=${!!this.serviceSpec.alertManagerEnabled}
                    ?disabled=${this.isSimple}
                    theme="condensed"
                    @checked-changed=${this.checkHandler('alertManagerEnabled')}
                >
                    Alert Manager
                </c6o-checkbox>
                <c6o-checkbox
                    ?checked=${!!this.serviceSpec.kubeMetricsEnabled}
                    ?disabled=${this.isSimple}
                    theme="condensed"
                    @checked-changed=${this.checkHandler('kubeMetricsEnabled')}
                >
                    Kube State Metrics
                </c6o-checkbox>
                <c6o-checkbox
                    ?checked=${!!this.serviceSpec.nodeExporterEnabled}
                    ?disabled=${this.isSimple}
                    theme="condensed"
                    @checked-changed=${this.checkHandler('nodeExporterEnabled')}
                >
                    Node Exporter
                </c6o-checkbox>
                <c6o-checkbox
                    ?checked=${!!this.serviceSpec.pushGatewayEnabled}
                    ?disabled=${this.isSimple}
                    theme="condensed"
                    @checked-changed=${this.checkHandler('pushGatewayEnabled')}
                >
                    Push Gateway
                </c6o-checkbox>
            </c6o-form-layout>
        `;
    }
};
tslib_1.__decorate([
    lit_element_1.property({ type: Boolean }),
    tslib_1.__metadata("design:type", Object)
], PrometheusMainInstall.prototype, "isSimple", void 0);
PrometheusMainInstall = tslib_1.__decorate([
    lit_element_1.customElement('prometheus-install-main')
], PrometheusMainInstall);
exports.PrometheusMainInstall = PrometheusMainInstall;
//# sourceMappingURL=main.js.map