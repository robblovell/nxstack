"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IstioSetup = void 0;
const tslib_1 = require("tslib");
const lit_element_1 = require("lit-element");
let IstioSetup = class IstioSetup extends lit_element_1.LitElement {
    constructor() {
        super(...arguments);
        this.updateHandler = (field) => (e) => {
            this.serviceSpec[field] = e.detail.value || e.target.value;
        };
        this.isValid = () => tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield window.customElements.whenDefined('c6o-text-field');
            if (!this.domainField.value.length) {
                this.domainField.invalid = true;
                this.domainField.errorMessage = 'Please enter a domain name';
                return false;
            }
            if (!this.hostnameField.value.length) {
                this.hostnameField.invalid = true;
                this.hostnameField.errorMessage = 'Please enter a hostname';
                return false;
            }
            this.domainField.invalid = this.hostnameField.invalid = false;
            this.domainField.errorMessage = this.hostnameField.errorMessage = '';
            return true;
        });
    }
    get serviceSpec() { return this.mediator.getServiceSpec('istio'); }
    get domainField() { return this.shadowRoot.getElementById('domain-name'); }
    get hostnameField() { return this.shadowRoot.getElementById('hostname'); }
    render() {
        return lit_element_1.html `
            <c6o-form-layout>
                <c6o-text-field
                    autoselect
                    id="domain-name"
                    label="Domain Name"
                    error-message="Please enter a domain name"
                    required
                    theme="condensed"
                    value=${this.serviceSpec.domainName || ''}
                    @input=${this.updateHandler('domainName')}
                ></c6o-text-field>
                <c6o-text-field
                    autoselect
                    id="hostname"
                    label="Hostname"
                    error-message="Please enter a hostname"
                    required
                    theme="condensed"
                    value=${this.serviceSpec.hostName || ''}
                    @input=${this.updateHandler('hostName')}
                ></c6o-text-field>
            </c6o-form-layout>

            <hr />

            <section c6o="grid 6">
                <c6o-form-layout>
                    <h3>Optional Components:</h3>
                    <c6o-checkbox
                        ?checked=${this.serviceSpec.httpsRedirect}
                        theme="condensed"
                        @checked-changed=${this.updateHandler('httpsRedirect')}
                    >
                        Enable https redirect
                    </c6o-checkbox>
                    <c6o-checkbox
                        ?checked=${this.serviceSpec.autoInjectEnabled}
                        theme="condensed"
                        @checked-changed=${this.updateHandler('autoInjectEnabled')}
                    >
                        Auto Injection
                    </c6o-checkbox>
                    <c6o-checkbox
                        ?checked=${this.serviceSpec.citadelEnabled}
                        theme="condensed"
                        @checked-changed=${this.updateHandler('citadelEnabled')}
                    >
                        Citadel (Authentication and Identity)
                    </c6o-checkbox>
                    <c6o-checkbox
                        ?checked=${this.serviceSpec.coreDnsEnabled}
                        theme="condensed"
                        @checked-changed=${this.updateHandler('coreDnsEnabled')}
                    >
                        Core DNS
                    </c6o-checkbox>
                    <c6o-checkbox
                        ?checked=${this.serviceSpec.galleyEnabled}
                        theme="condensed"
                        @checked-changed=${this.updateHandler('galleyEnabled')}
                    >
                        Galley (Configuration)
                    </c6o-checkbox>
                    <c6o-checkbox
                        ?checked=${this.serviceSpec.policyEnabled}
                        theme="condensed"
                        @checked-changed=${this.updateHandler('policyEnabled')}
                    >
                        Policy
                    </c6o-checkbox>
                    <c6o-checkbox
                        ?checked=${this.serviceSpec.telemetryEnabled}
                        theme="condensed"
                        @checked-changed=${this.updateHandler('telemetryEnabled')}
                    >
                        Telemetry (Analytics)
                    </c6o-checkbox>
                </c6o-form-layout>
                <div id="required-components">
                    <h3>Required Components:</h3>
                    <p class="help-text">
                        The following Istio dependencies will be included in the installation:
                    </p>
                    <ul>
                        <li>Istio Base (CRDs)</li>
                        <li>Gateway (Ingress)</li>
                        <li>Pilot (Traffic Management)</li>
                    </ul>
                </div>
            </section>
        `;
    }
    end() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (yield this.isValid()) {
                return true;
            }
            return false;
        });
    }
};
IstioSetup = tslib_1.__decorate([
    lit_element_1.customElement('istio-install-main')
], IstioSetup);
exports.IstioSetup = IstioSetup;
//# sourceMappingURL=install.js.map