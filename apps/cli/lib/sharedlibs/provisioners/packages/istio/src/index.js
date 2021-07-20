"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Provisioner = void 0;
const tslib_1 = require("tslib");
const mixwith_1 = require("mixwith");
const common_1 = require("@provisioner/common");
const mixins_1 = require("./mixins");
tslib_1.__exportStar(require("./contracts"), exports);
class Provisioner extends mixwith_1.mix(common_1.ProvisionerBase).with(mixins_1.removeApplyMixin, mixins_1.createInquireMixin, mixins_1.createApplyMixin, mixins_1.updateApplyMixin, mixins_1.grafanaMixin, mixins_1.gatewayApiMixin, mixins_1.prometheusApiMixin, mixins_1.choicesApiMixin, mixins_1.httpsRedirectApiMixin, mixins_1.virtualServiceApiMixin) {
}
exports.Provisioner = Provisioner;
tslib_1.__exportStar(require("./constants"), exports);
//# sourceMappingURL=index.js.map