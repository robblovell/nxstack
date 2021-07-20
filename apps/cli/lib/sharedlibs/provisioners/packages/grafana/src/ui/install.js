"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GrafanaCredentials = void 0;
const tslib_1 = require("tslib");
const lit_element_1 = require("lit-element");
let GrafanaCredentials = class GrafanaCredentials extends lit_element_1.LitElement {
    constructor() {
        super(...arguments);
        this.values = ['1Gi', '2Gi', '4Gi'];
        this.storageSelected = (e) => {
            this.serviceSpec.storage = e.detail.value;
        };
        this.usernameChanged = (e) => {
            this.serviceSpec.adminUsername = e.target.value;
        };
        this.passwordChanged = (e) => {
            this.serviceSpec.adminPassword = e.target.value;
        };
    }
    get serviceSpec() {
        return this.mediator.getServiceSpec('grafana');
    }
    render() {
        return lit_element_1.html `
            <c6o-form-layout>
                <c6o-combo-box
                    allow-custom-value
                    .items=${this.values}
                    label="Grafana Storage"
                    required
                    value=${this.serviceSpec.storage}
                    @selected-item-changed=${this.storageSelected}
                ></c6o-combo-box>
            </c6o-form-layout>
            <c6o-form-layout>
                <c6o-text-field
                    autoselect
                    label="Administrator username"
                    required
                    value=${this.serviceSpec.adminUsername}
                    @input=${this.usernameChanged}
                ></c6o-text-field>
                <br />
                <c6o-text-field
                    autoselect
                    label="Administrator password"
                    required
                    value=${this.serviceSpec.adminPassword}
                    @input=${this.passwordChanged}
                ></c6o-text-field>
            </c6o-form-layout>
        `;
    }
    begin() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            this.serviceSpec.storage = this.serviceSpec.storage || '2Gi';
            this.serviceSpec.adminUsername = this.serviceSpec.adminUsername || 'admin';
            this.serviceSpec.adminPassword = this.serviceSpec.adminPassword || 'admin';
        });
    }
};
GrafanaCredentials = tslib_1.__decorate([
    lit_element_1.customElement('grafana-install-main')
], GrafanaCredentials);
exports.GrafanaCredentials = GrafanaCredentials;
//# sourceMappingURL=install.js.map