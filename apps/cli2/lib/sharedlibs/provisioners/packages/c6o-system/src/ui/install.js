"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TraxittSystemSetup = void 0;
const tslib_1 = require("tslib");
const lit_element_1 = require("lit-element");
let TraxittSystemSetup = class TraxittSystemSetup extends lit_element_1.LitElement {
    constructor() {
        super(...arguments);
        this.companyNameChanged = (e) => {
            this.serviceSpec.companyName = e.target.value;
        };
        this.clusterNameChanged = (e) => {
            this.serviceSpec.clusterName = e.target.value;
        };
    }
    get serviceSpec() {
        return this.mediator.getServiceSpec('c6o-system');
    }
    render() {
        return lit_element_1.html `
            <c6o-form-layout>
                <c6o-text-field
                    autoselect
                    colspan="2"
                    label="Company Name"
                    path="companyName"
                    required
                    @input=${this.companyNameChanged}
                ></c6o-text-field>
                <c6o-text-field
                    autoselect
                    colspan="2"
                    label="Cluster Name"
                    path="clusterName"
                    required
                    @input=${this.clusterNameChanged}
                ></c6o-text-field>
            </c6o-form-layout>
        `;
    }
};
TraxittSystemSetup = tslib_1.__decorate([
    lit_element_1.customElement('c6o-system-setup')
], TraxittSystemSetup);
exports.TraxittSystemSetup = TraxittSystemSetup;
//# sourceMappingURL=install.js.map