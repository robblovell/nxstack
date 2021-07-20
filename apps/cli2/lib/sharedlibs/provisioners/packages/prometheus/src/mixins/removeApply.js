"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeApplyMixin = void 0;
const tslib_1 = require("tslib");
const removeApplyMixin = (base) => class extends base {
    removeApply() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const namespace = this.controller.resource.metadata.namespace;
            if (this.spec.simpleService) {
                yield this.controller.cluster
                    .begin('Remove simple prometheus services')
                    .deleteFile('../../k8s/prometheus-simple-cm.yaml', { namespace })
                    .deleteFile('../../k8s/prometheus-simple.yaml', { namespace })
                    .end();
                return;
            }
            yield this.controller.cluster
                .begin('Remove prometheus server')
                .deleteFile('../../k8s/prometheus-server.yaml', { namespace })
                .deleteFile('../../k8s/prometheus-alertmanager.yaml', { namespace })
                .deleteFile('../../k8s/prometheus-kubemetrics.yaml', { namespace })
                .deleteFile('../../k8s/prometheus-nodeexporter.yaml', { namespace })
                .deleteFile('../../k8s/prometheus-pushgateway.yaml', { namespace })
                .end();
        });
    }
};
exports.removeApplyMixin = removeApplyMixin;
//# sourceMappingURL=removeApply.js.map