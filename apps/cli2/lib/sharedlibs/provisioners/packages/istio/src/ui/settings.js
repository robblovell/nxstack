"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IstioSettings = void 0;
const tslib_1 = require("tslib");
const lit_element_1 = require("lit-element");
const istio_1 = require("@provisioner/istio");
let IstioSettings = class IstioSettings extends lit_element_1.LitElement {
    constructor() {
        super(...arguments);
        this.loaded = false;
        this.httpsRedirectChanged = (e) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            this.httpsRedirect = e.detail.value;
        });
        this.linkGrafana = () => tslib_1.__awaiter(this, void 0, void 0, function* () {
            this.grafanaNamespace = this.grafanaComboBox.value;
        });
        this.linkPrometheus = () => tslib_1.__awaiter(this, void 0, void 0, function* () {
            this.prometheusNamespace = this.prometheusComboBox.value;
        });
        this.unlinkGrafana = () => tslib_1.__awaiter(this, void 0, void 0, function* () {
            this.grafanaNamespace = istio_1.unlinkToken;
        });
        this.unlinkPrometheus = () => tslib_1.__awaiter(this, void 0, void 0, function* () {
            this.prometheusNamespace = istio_1.unlinkToken;
            this.grafanaNamespace = istio_1.unlinkToken;
        });
        this.resetSettings = () => tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield this.renderSettings(this.api.manifest);
        });
        this.isBusy = (manifest) => manifest.status !== 'Running' && manifest.status !== 'Error';
        this.renderSettings = (manifest) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            if (manifest) {
                this.busy = this.isBusy(manifest);
                this.grafanaNamespace = ((_a = manifest.spec.provisioner) === null || _a === void 0 ? void 0 : _a['grafana-link']) || istio_1.unlinkToken;
                this.prometheusNamespace = ((_b = manifest.spec.provisioner) === null || _b === void 0 ? void 0 : _b['prometheus-link']) || istio_1.unlinkToken;
                this.httpsRedirect = !!((_c = manifest.spec.provisioner) === null || _c === void 0 ? void 0 : _c.httpsRedirect);
            }
            const result = yield this.choicesService.find({});
            this.prometheusOptions = result.prometheusOptions;
            this.grafanaOptions = result.grafanaOptions;
        });
        this.applyChanges = (e) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            this.busy = true;
            yield this.api.patchManifest({
                spec: {
                    provisioner: Object.assign(Object.assign({ ['grafana-link']: this.grafanaNamespace }, { ['prometheus-link']: this.prometheusNamespace }), { httpsRedirect: this.httpsRedirect })
                }
            });
        });
    }
    static get styles() {
        return lit_element_1.css `
            .inline {
                margin-left: 15px;
                width: auto !important;
            }

            h3 {
                color: #2a343e;
                margin-block-start: 0;
            }

            .btn-footer {
                border-top: 1px solid hsla(214, 57%, 24%, 0.1);
                display: flex;
                justify-content: space-between;
                margin-top: 15px;
                padding-top: 15px;
            }

            hr {
                margin-bottom: 30px;
                border: 0;
                border-top: 1px solid hsla(214, 57%, 24%, 0.1);
            }
        `;
    }
    get grafanaComboBox() { return this.shadowRoot.querySelector('#grafana-combo-box'); }
    get prometheusComboBox() { return this.shadowRoot.querySelector('#prometheus-combo-box'); }
    render() {
        if (!this.loaded)
            return lit_element_1.html `<c6o-loading></c6o-loading>`;
        return lit_element_1.html `
            <div id="prometheus">
                ${this.renderPrometheusLink()}
            </div>
            <div id="grafana">
                ${this.renderGrafanaLink()}
            </div>
            <c6o-checkbox
                ?checked=${this.httpsRedirect}
                ?disabled=${this.busy}
                @checked-changed=${this.httpsRedirectChanged}
            >
                Enable https redirect
            </c6o-checkbox>
            <div class="btn-footer">
                <c6o-button theme="default" @click=${this.resetSettings} ?disabled=${this.busy}>Reset Changes</c6o-button>
                <c6o-button theme="primary" @click=${this.applyChanges} ?disabled=${this.busy}>Apply Changes</c6o-button>
            </div>
        `;
    }
    renderGrafanaLink() {
        if (this.grafanaNamespace !== istio_1.unlinkToken)
            return lit_element_1.html `
                <c6o-form-layout>
                    <h3>Grafana Linked</h3>
                    <c6o-button
                        class="inline"
                        theme="tertiary"
                        @click=${this.unlinkGrafana}
                        ?disabled=${this.busy}>
                        Unlink Grafana in ${this.grafanaNamespace}
                    </c6o-button>
                </c6o-form-layout>
            `;
        return lit_element_1.html `
            <c6o-form-layout>
                <c6o-combo-box
                    ?disabled=${this.busy || this.prometheusNamespace === istio_1.unlinkToken}
                    id='grafana-combo-box'
                    .items=${this.grafanaOptions}
                    label='Select Grafana Installation'
                    required
                    value=${this.grafanaOptions[0]}
                ></c6o-combo-box>
                <c6o-button
                    class="inline"
                    ?disabled=${this.busy || this.prometheusNamespace === istio_1.unlinkToken}
                    theme="tertiary"
                    @click=${this.linkGrafana}
                >
                    Link Grafana
                </c6o-button>
            </c6o-form-layout>
        `;
    }
    renderPrometheusLink() {
        if (this.prometheusNamespace !== istio_1.unlinkToken)
            return lit_element_1.html `
                <c6o-form-layout>
                    <h3>Prometheus Linked</h3>
                    <c6o-button
                        class="inline"
                        ?disabled=${this.busy}
                        theme="tertiary"
                        @click=${this.unlinkPrometheus}
                    >
                        Unlink Prometheus in ${this.prometheusNamespace}
                    </c6o-button>
                </c6o-form-layout>
            `;
        return lit_element_1.html `
            <c6o-form-layout>
                <c6o-combo-box
                    ?disabled=${this.busy}
                    id='prometheus-combo-box'
                    .items=${this.prometheusOptions}
                    label='Select Prometheus Installation'
                    required
                    value=${this.prometheusOptions[0]}
                ></c6o-combo-box>
                <c6o-button
                    class="inline"
                    ?disabled=${this.busy}
                    theme="tertiary"
                    @click=${this.linkPrometheus}
                >
                    Link Prometheus
                </c6o-button>
            </c6o-form-layout>
        `;
    }
    connectedCallback() {
        const _super = Object.create(null, {
            connectedCallback: { get: () => super.connectedCallback }
        });
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield _super.connectedCallback.call(this);
            this.choicesService = this.api.createService('choices');
            this.api.watchManifest(this.renderSettings);
            yield this.renderSettings(this.api.manifest);
            this.loaded = true;
        });
    }
};
tslib_1.__decorate([
    lit_element_1.property({ type: Object }),
    tslib_1.__metadata("design:type", Object)
], IstioSettings.prototype, "grafanaNamespace", void 0);
tslib_1.__decorate([
    lit_element_1.property({ type: Object }),
    tslib_1.__metadata("design:type", Object)
], IstioSettings.prototype, "grafanaOptions", void 0);
tslib_1.__decorate([
    lit_element_1.property({ type: Object }),
    tslib_1.__metadata("design:type", Object)
], IstioSettings.prototype, "prometheusNamespace", void 0);
tslib_1.__decorate([
    lit_element_1.property({ type: Object }),
    tslib_1.__metadata("design:type", Object)
], IstioSettings.prototype, "prometheusOptions", void 0);
tslib_1.__decorate([
    lit_element_1.property({ type: Boolean }),
    tslib_1.__metadata("design:type", Boolean)
], IstioSettings.prototype, "httpsRedirect", void 0);
tslib_1.__decorate([
    lit_element_1.property({ type: Boolean }),
    tslib_1.__metadata("design:type", Object)
], IstioSettings.prototype, "busy", void 0);
tslib_1.__decorate([
    lit_element_1.property({ type: Boolean }),
    tslib_1.__metadata("design:type", Object)
], IstioSettings.prototype, "loaded", void 0);
IstioSettings = tslib_1.__decorate([
    lit_element_1.customElement('istio-settings-main')
], IstioSettings);
exports.IstioSettings = IstioSettings;
//# sourceMappingURL=settings.js.map