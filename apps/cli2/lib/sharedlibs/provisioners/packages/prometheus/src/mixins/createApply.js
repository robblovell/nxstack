"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApplyMixin = void 0;
const tslib_1 = require("tslib");
const createApplyMixin = (base) => class extends base {
    createApply() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield this.installPrometheusComponents();
            yield this.ensurePrometheusIsRunning();
        });
    }
    get prometheusPods() {
        return {
            kind: 'Pod',
            metadata: {
                namespace: this.serviceNamespace,
                labels: {
                    name: 'prometheus-server'
                }
            }
        };
    }
    installPrometheusComponents() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const namespace = this.serviceNamespace;
            const { simpleService, alertManagerEnabled, kubeMetricsEnabled, nodeExporterEnabled, pushGatewayEnabled } = this.spec;
            if (simpleService) {
                yield this.controller.cluster
                    .begin('Install simple prometheus services')
                    .list(this.prometheusPods)
                    .do((result, processor) => {
                    var _a, _b;
                    if (((_b = (_a = result === null || result === void 0 ? void 0 : result.object) === null || _a === void 0 ? void 0 : _a.items) === null || _b === void 0 ? void 0 : _b.length) == 0) {
                        processor
                            .upsertFile('../../k8s/prometheus-simple-cm.yaml', { namespace })
                            .upsertFile('../../k8s/prometheus-simple.yaml', { namespace });
                    }
                })
                    .end();
                return;
            }
            yield this.controller.cluster
                .begin('Install prometheus server')
                .upsertFile('../../k8s/prometheus-server.yaml', { namespace })
                .upsertFile('../../k8s/prometheus-configmap.yaml', { namespace })
                .end();
            if (alertManagerEnabled) {
                yield this.controller.cluster
                    .begin('Install alert manager')
                    .upsertFile('../../k8s/prometheus-alertmanager.yaml', { namespace })
                    .end();
            }
            if (kubeMetricsEnabled) {
                yield this.controller.cluster
                    .begin('Install kube state metrics components')
                    .upsertFile('../../k8s/prometheus-kubemetrics.yaml', { namespace })
                    .end();
            }
            if (nodeExporterEnabled) {
                yield this.controller.cluster
                    .begin('Install node exporter')
                    .upsertFile('../../k8s/prometheus-nodeexporter.yaml', { namespace })
                    .end();
            }
            if (pushGatewayEnabled) {
                yield this.controller.cluster
                    .begin('Install push gateway components')
                    .upsertFile('../../k8s/prometheus-pushgateway.yaml', { namespace })
                    .end();
            }
        });
    }
    ensurePrometheusIsRunning() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield this.controller.cluster.
                begin('Ensure Prometheus server is running')
                .beginWatch(this.prometheusPods)
                .whenWatch(({ condition }) => condition.Ready == 'True', (processor, pod) => {
                processor.endWatch();
            })
                .end();
        });
    }
};
exports.createApplyMixin = createApplyMixin;
//# sourceMappingURL=createApply.js.map