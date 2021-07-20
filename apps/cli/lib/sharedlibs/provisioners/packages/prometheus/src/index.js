"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Provisioner = void 0;
const tslib_1 = require("tslib");
const mixwith_1 = require("mixwith");
const common_1 = require("@provisioner/common");
tslib_1.__exportStar(require("./contracts"), exports);
const mixins_1 = require("./mixins");
class Provisioner extends mixwith_1.mix(common_1.ProvisionerBase).with(mixins_1.preAskMixin, mixins_1.askMixin, mixins_1.apiMixin, mixins_1.helpMixin, mixins_1.removeInquireMixin, mixins_1.removeApplyMixin, mixins_1.createInquireMixin, mixins_1.createApplyMixin) {
    simpleServiceProvided(answers) { return !!(super.spec.simpleService || answers.simple); }
}
exports.Provisioner = Provisioner;
//# sourceMappingURL=index.js.map