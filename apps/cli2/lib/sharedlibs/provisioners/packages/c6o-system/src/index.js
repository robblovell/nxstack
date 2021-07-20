"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Provisioner = void 0;
const tslib_1 = require("tslib");
const mixwith_1 = require("mixwith");
const common_1 = require("@provisioner/common");
tslib_1.__exportStar(require("./contracts"), exports);
const mixins_1 = require("./mixins");
tslib_1.__exportStar(require("./constants"), exports);
class Provisioner extends mixwith_1.mix(common_1.ProvisionerBase).with(mixins_1.postAppMixin, mixins_1.removeApplyMixin, mixins_1.createApplyMixin, mixins_1.updateApplyMixin, mixins_1.updateSystemMixin, mixins_1.createValidateMixin, mixins_1.createInquireMixin, mixins_1.choicesApiMixin, mixins_1.hostApiMixin, mixins_1.loggerApiMixin, mixins_1.npmApiMixin, mixins_1.metricsMixin) {
    constructor() {
        super(...arguments);
        this.getIstioProvisioner = () => tslib_1.__awaiter(this, void 0, void 0, function* () { return yield this.controller.resolver.getProvisioner('istio-system', 'istio'); });
    }
}
exports.Provisioner = Provisioner;
//# sourceMappingURL=index.js.map