"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApplyMixin = void 0;
const tslib_1 = require("tslib");
const createApplyMixin = (base) => class extends base {
    get nodeGrafanaPods() {
        return {
            kind: 'Pod',
            metadata: {
                namespace: this.serviceNamespace,
                labels: {
                    name: 'grafana'
                }
            }
        };
    }
    createApply() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield this.ensureGrafanaIsInstalled();
            yield this.ensureGrafanaIsRunning();
        });
    }
    ensureGrafanaIsInstalled() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const namespace = this.serviceNamespace;
            const { storageClass, storage, adminUsername, adminPassword } = this.spec;
            yield this.controller.cluster
                .begin('Install Grafana services')
                .list(this.nodeGrafanaPods)
                .do((result, processor) => {
                var _a, _b;
                if (((_b = (_a = result === null || result === void 0 ? void 0 : result.object) === null || _a === void 0 ? void 0 : _a.items) === null || _b === void 0 ? void 0 : _b.length) == 0) {
                    processor
                        .upsertFile('../../k8s/pvc.yaml', { namespace, storage, storageClass })
                        .addOwner(this.controller.resource)
                        .upsertFile('../../k8s/deployment.yaml', { namespace, adminUsername, adminPassword })
                        .upsertFile('../../k8s/service.yaml', { namespace });
                }
            })
                .end();
        });
    }
    ensureGrafanaIsRunning() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield this.controller.cluster
                .begin('Ensure a Grafana replica is running')
                .beginWatch(this.nodeGrafanaPods)
                .whenWatch(({ condition }) => condition.Ready == 'True', (processor, pod) => {
                processor.endWatch();
            })
                .end();
        });
    }
};
exports.createApplyMixin = createApplyMixin;
//# sourceMappingURL=createApply.js.map