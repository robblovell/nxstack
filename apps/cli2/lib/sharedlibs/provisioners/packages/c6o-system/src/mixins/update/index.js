"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSystemMixin = void 0;
const tslib_1 = require("tslib");
const debug_1 = tslib_1.__importDefault(require("debug"));
const common_1 = require("@provisioner/common");
const constants_1 = require("../../constants");
const debug = debug_1.default('provisioner:c6o-system:updateSystem:');
const updateSystemMixin = (base) => class extends base {
    constructor() {
        super(...arguments);
        this.performUpdate = (tag) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield common_1.updateImageTag(this.controller.cluster, {
                apiVersion: 'apps/v1',
                kind: 'Deployment',
                metadata: {
                    namespace: 'c6o-system',
                    labels: { role: 'system' }
                }
            }, tag, '/spec/template/spec/containers/0/image');
            yield common_1.updateImageTag(this.controller.cluster, {
                apiVersion: 'batch/v1beta1',
                kind: 'CronJob',
                metadata: {
                    namespace: 'c6o-system',
                    labels: { role: 'system' }
                }
            }, tag, '/spec/jobTemplate/spec/template/spec/containers/0/image');
        });
    }
    updateSystem() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (this.spec.updateToTag) {
                yield this.performUpdate(this.spec.updateToTag);
                this.controller.resource.spec.provisioner.tag = this.spec.updateToTag;
                this.controller.resource.spec.provisioner.updateToTag = constants_1.unlinkToken;
            }
        });
    }
};
exports.updateSystemMixin = updateSystemMixin;
//# sourceMappingURL=index.js.map