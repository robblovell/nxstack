"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UninstallVSCode = void 0;
const tslib_1 = require("tslib");
const lit_element_1 = require("lit-element");
let UninstallVSCode = class UninstallVSCode extends lit_element_1.LitElement {
    constructor() {
        super(...arguments);
        this.checkHandler = (field) => (e) => {
            this.serviceSpec.deprovision[field] = e.detail.value;
        };
    }
    get serviceSpec() {
        return this.mediator.getServiceSpec('grafana');
    }
    render() {
        return lit_element_1.html `
        <c6o-form-layout>
            <c6o-checkbox
                ?checked=${!!this.serviceSpec.deprovision['force']}
                @checked-changed=${this.checkHandler('force')}
            >
                Force deprovision with added dashboards
            </c6o-checkbox>
        </c6o-form-layout>
        `;
    }
    begin() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            this.serviceSpec.deprovision = {
                'force': false
            };
        });
    }
};
UninstallVSCode = tslib_1.__decorate([
    lit_element_1.customElement('grafana-uninstall-main')
], UninstallVSCode);
exports.UninstallVSCode = UninstallVSCode;
//# sourceMappingURL=uninstall.js.map