"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TraxittSystemSettings = void 0;
const tslib_1 = require("tslib");
const lit_element_1 = require("lit-element");
const contracts_1 = require("@provisioner/contracts");
const constants_1 = require("../constants");
let TraxittSystemSettings = class TraxittSystemSettings extends lit_element_1.LitElement {
    constructor() {
        super(...arguments);
        this.loaded = false;
        this.linkNpm = () => tslib_1.__awaiter(this, void 0, void 0, function* () {
            this.npmLink = this.npmOptions.find(option => option.name === this.npmComboBox.value);
            const npmLinkOption = this.npmOptions.find(option => option.name === this.npmComboBox.value);
            this.npmLink = (npmLinkOption === null || npmLinkOption === void 0 ? void 0 : npmLinkOption.name) ? {
                name: npmLinkOption.name,
                username: this.npmUsername.value,
                password: this.npmPassword.value
            } :
                this.npmURL.value ? {
                    url: this.npmURL.value,
                    username: this.npmUsername.value,
                    password: this.npmPassword.value
                } :
                    undefined;
        });
        this.unlinkNpm = () => tslib_1.__awaiter(this, void 0, void 0, function* () {
            this.npmLink = constants_1.unlinkToken;
        });
        this.linkLogger = () => tslib_1.__awaiter(this, void 0, void 0, function* () {
            this.loggingLink = this.loggerComboBox.value;
        });
        this.unlinkLogger = () => tslib_1.__awaiter(this, void 0, void 0, function* () {
            this.loggingLink = constants_1.unlinkToken;
        });
        this.linkPrometheus = () => tslib_1.__awaiter(this, void 0, void 0, function* () {
            this.prometheusLink = this.prometheusComboBox.value;
        });
        this.unlinkPrometheus = () => tslib_1.__awaiter(this, void 0, void 0, function* () {
            this.prometheusLink = constants_1.unlinkToken;
            this.grafanaLink = constants_1.unlinkToken;
        });
        this.linkGrafana = () => tslib_1.__awaiter(this, void 0, void 0, function* () {
            this.grafanaLink = this.grafanaComboBox.value;
        });
        this.unlinkGrafana = () => tslib_1.__awaiter(this, void 0, void 0, function* () {
            this.grafanaLink = constants_1.unlinkToken;
        });
        this.resetSettings = () => tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield this.renderSettings(this.api.manifest);
        });
        this.isBusy = (manifest) => manifest.status !== contracts_1.AppStatuses.update.Completed && manifest.status !== contracts_1.AppStatuses.update.Error;
        this.renderSettings = (manifest) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d;
            if (manifest) {
                this.busy = this.isBusy(manifest);
                this.loggingLink = ((_a = manifest.spec.provisioner) === null || _a === void 0 ? void 0 : _a['logging-link']) || constants_1.unlinkToken;
                this.npmLink = ((_b = manifest.spec.provisioner) === null || _b === void 0 ? void 0 : _b['npm-link']) || constants_1.unlinkToken;
                this.prometheusLink = ((_c = manifest.spec.provisioner) === null || _c === void 0 ? void 0 : _c['prometheus-link']) || constants_1.unlinkToken;
                this.grafanaLink = ((_d = manifest.spec.provisioner) === null || _d === void 0 ? void 0 : _d['grafana-link']) || constants_1.unlinkToken;
            }
            const result = yield this.choicesService.find({});
            this.loggerOptions = result.loggerOptions;
            this.npmOptions = result.npmOptions;
            this.prometheusOptions = result.prometheusOptions;
            this.grafanaOptions = result.grafanaOptions;
        });
        this.applyChanges = (e) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            var _e, _f;
            this.busy = true;
            let encodedLink = constants_1.unlinkToken;
            if (this.npmLink !== constants_1.unlinkToken) {
                encodedLink = Object.assign(Object.assign(Object.assign({ name: this.npmLink.name }, { url: this.npmLink.url }), { username: ((_e = this.npmLink.username) === null || _e === void 0 ? void 0 : _e.length) ? window.btoa(this.npmLink.username) : undefined }), { password: ((_f = this.npmLink.password) === null || _f === void 0 ? void 0 : _f.length) ? window.btoa(this.npmLink.password) : undefined });
            }
            yield this.api.patchManifest({
                spec: {
                    provisioner: Object.assign(Object.assign(Object.assign({ ['npm-link']: encodedLink }, { ['logging-link']: this.loggingLink }), { ['prometheus-link']: this.prometheusLink }), { ['grafana-link']: this.grafanaLink })
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
    get loggerComboBox() { return this.shadowRoot.querySelector('#logger-combo-box'); }
    get npmComboBox() { return this.shadowRoot.querySelector('#npm-combo-box'); }
    get npmURL() { return this.shadowRoot.querySelector('#npm-url'); }
    get npmUsername() { return this.shadowRoot.querySelector('#npm-username'); }
    get npmPassword() { return this.shadowRoot.querySelector('#npm-password'); }
    get grafanaComboBox() { return this.shadowRoot.querySelector('#grafana-combo-box'); }
    get prometheusComboBox() { return this.shadowRoot.querySelector('#prometheus-combo-box'); }
    render() {
        if (!this.loaded)
            return lit_element_1.html `<c6o-loading></c6o-loading>`;
        return lit_element_1.html `
            <div id="npm">
                ${this.renderNpmLink()}
            </div>
            <hr />
            <div id="logging">
                ${this.renderLoggingLink()}
            </div>
            <div id="prometheus">
                ${this.renderPrometheusLink()}
            </div>
            <div id="grafana">
                ${this.renderGrafanaLink()}
            </div>
            <div class="btn-footer">
                <c6o-button theme="default" @click=${this.resetSettings} ?disabled=${this.busy}>Reset Changes</c6o-button>
                <c6o-button theme="primary" @click=${this.applyChanges} ?disabled=${this.busy}>Apply Changes</c6o-button>
            </div>
        `;
    }
    get npmOptionsList() {
        return this.npmOptions.map(option => option.name);
    }
    renderNpmLink() {
        if (this.npmLink !== constants_1.unlinkToken)
            return lit_element_1.html `
                <c6o-form-layout>
                    <h3>NPM Registry Linked</h3>
                    <c6o-button
                        class="inline"
                        theme="tertiary"
                        @click=${this.unlinkNpm}
                        ?disabled=${this.busy}>
                        Unlink npm from ${this.npmLink.name}
                    </c6o-button>
                </c6o-form-layout>
            `;
        return lit_element_1.html `
            <c6o-form-layout>
                <c6o-combo-box
                    ?disabled=${this.busy}
                    id='npm-combo-box'
                    .items=${this.npmOptionsList}
                    label='Select NPM Registry'
                    required
                    value=${this.npmOptionsList[0]}
                ></c6o-combo-box>
                <c6o-text-field autoselect id='npm-url' label="Registry URL"></c6o-text-field>
                <c6o-text-field autoselect id='npm-username' label="Registry username" required></c6o-text-field>
                <vaadin-password-field autoselect id='npm-password' label="Registry password" required></vaadin-password-field>
                <c6o-button
                    class="inline"
                    ?disabled=${this.busy}
                    theme="tertiary"
                    @click=${this.linkNpm}
                >
                    Link NPM Registry
                </c6o-button>
            </c6o-form-layout>
        `;
    }
    renderLoggingLink() {
        if (this.loggingLink !== constants_1.unlinkToken)
            return lit_element_1.html `
                <c6o-form-layout>
                    <h3>Logger Linked</h3>
                    <c6o-button
                        class="inline"
                        ?disabled=${this.busy}
                        theme="tertiary"
                        @click=${this.unlinkLogger}
                    >
                        Unlink logger in ${this.loggingLink}
                    </c6o-button>
                </c6o-form-layout>
            `;
        return lit_element_1.html `
            <c6o-form-layout>
                <c6o-combo-box
                    ?disabled=${this.busy}
                    id='logger-combo-box'
                    .items=${this.loggerOptions}
                    label='Select Logger Installation'
                    required
                    value=${this.loggerOptions[0]}
                ></c6o-combo-box>
                <c6o-button
                    class="inline"
                    ?disabled=${this.busy}
                    theme="tertiary"
                    @click=${this.linkLogger}
                >
                    Link Logger
                </c6o-button>
            </c6o-form-layout>
        `;
    }
    renderPrometheusLink() {
        if (this.prometheusLink !== constants_1.unlinkToken)
            return lit_element_1.html `
                <c6o-form-layout>
                    <h3>Prometheus Linked</h3>
                    <c6o-button
                        class="inline"
                        ?disabled=${this.busy}
                        theme="tertiary"
                        @click=${this.unlinkPrometheus}
                    >
                        Unlink Prometheus in ${this.prometheusLink} for Metrics
                    </c6o-button>
                </c6o-form-layout>
            `;
        return lit_element_1.html `
            <c6o-form-layout>
                <c6o-combo-box
                    ?disabled=${this.busy}
                    id='prometheus-combo-box'
                    .items=${this.prometheusOptions}
                    label='Select Prometheus for Metrics'
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
    renderGrafanaLink() {
        if (this.grafanaLink !== constants_1.unlinkToken)
            return lit_element_1.html `
                <c6o-form-layout>
                    <h3>Grafana Linked</h3>
                    <c6o-button
                        class="inline"
                        ?disabled=${this.busy}
                        theme="tertiary"
                        @click=${this.unlinkGrafana}
                    >
                        Unlink Grafana in ${this.grafanaLink} for Metrics
                    </c6o-button>
                </c6o-form-layout>
            `;
        return lit_element_1.html `
            <c6o-form-layout>
                <c6o-combo-box
                    ?disabled=${this.busy}
                    id='grafana-combo-box'
                    .items=${this.grafanaOptions}
                    label='Select Grafana for Metrics'
                    required
                    value=${this.grafanaOptions[0]}
                ></c6o-combo-box>
                <c6o-button
                    class="inline"
                    ?disabled=${this.busy}
                    theme="tertiary"
                    @click=${this.linkGrafana}
                >
                    Link Grafana
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
    lit_element_1.property({ type: String }),
    tslib_1.__metadata("design:type", Object)
], TraxittSystemSettings.prototype, "loggingLink", void 0);
tslib_1.__decorate([
    lit_element_1.property({ type: Object }),
    tslib_1.__metadata("design:type", Object)
], TraxittSystemSettings.prototype, "loggerOptions", void 0);
tslib_1.__decorate([
    lit_element_1.property({ type: Object }),
    tslib_1.__metadata("design:type", Object)
], TraxittSystemSettings.prototype, "npmLink", void 0);
tslib_1.__decorate([
    lit_element_1.property({ type: Object }),
    tslib_1.__metadata("design:type", Object)
], TraxittSystemSettings.prototype, "npmOptions", void 0);
tslib_1.__decorate([
    lit_element_1.property({ type: Object }),
    tslib_1.__metadata("design:type", Object)
], TraxittSystemSettings.prototype, "prometheusLink", void 0);
tslib_1.__decorate([
    lit_element_1.property({ type: Object }),
    tslib_1.__metadata("design:type", Object)
], TraxittSystemSettings.prototype, "prometheusOptions", void 0);
tslib_1.__decorate([
    lit_element_1.property({ type: Object }),
    tslib_1.__metadata("design:type", Object)
], TraxittSystemSettings.prototype, "grafanaLink", void 0);
tslib_1.__decorate([
    lit_element_1.property({ type: Object }),
    tslib_1.__metadata("design:type", Object)
], TraxittSystemSettings.prototype, "grafanaOptions", void 0);
tslib_1.__decorate([
    lit_element_1.property({ type: Boolean }),
    tslib_1.__metadata("design:type", Object)
], TraxittSystemSettings.prototype, "busy", void 0);
tslib_1.__decorate([
    lit_element_1.property({ type: Boolean }),
    tslib_1.__metadata("design:type", Object)
], TraxittSystemSettings.prototype, "loaded", void 0);
TraxittSystemSettings = tslib_1.__decorate([
    lit_element_1.customElement('c6o-system-settings-main')
], TraxittSystemSettings);
exports.TraxittSystemSettings = TraxittSystemSettings;
//# sourceMappingURL=settings.js.map