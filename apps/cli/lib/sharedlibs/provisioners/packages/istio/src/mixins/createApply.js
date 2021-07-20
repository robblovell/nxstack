"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApplyMixin = void 0;
const tslib_1 = require("tslib");
const expectedCRDCount = 25;
const createApplyMixin = (base) => class extends base {
    get crdDocument() {
        return {
            apiVersion: 'apiextensions.k8s.io/v1beta1',
            kind: 'CustomResourceDefinition',
            metadata: {
                namespace: this.serviceNamespace,
                labels: {
                    release: 'istio'
                }
            }
        };
    }
    get ingressPod() {
        return {
            kind: 'Pod',
            metadata: {
                namespace: this.serviceNamespace,
                labels: { istio: 'ingressgateway' }
            }
        };
    }
    get istiodPod() {
        return {
            kind: 'Pod',
            metadata: {
                namespace: this.serviceNamespace,
                labels: { istio: 'pilot' }
            }
        };
    }
    get expectedTlsCertificate() {
        return {
            apiVersion: 'v1',
            kind: 'Secret',
            type: 'kubernetes.io/tls',
            metadata: {
                name: 'c6o-system-certificate-tls',
                namespace: 'cert-manager'
            }
        };
    }
    createApply() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield this.installCrds();
            yield this.ensureCrdsApplied();
            yield this.installIstioServices();
            yield this.getExternalAddress();
        });
    }
    installCrds() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield this.controller.cluster
                .begin('Install resource definitions')
                .upsertFile('../../k8s/crds.yaml')
                .end();
        });
    }
    installIstioServices() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield this.controller.cluster
                .begin('Install Istiod')
                .upsertFile('../../k8s/traffic.yaml')
                .end();
            yield this.ensureIstiodIsRunning();
            yield this.controller.cluster
                .begin('Install Ingress Gateway')
                .upsertFile('../../k8s/gateway.yaml')
                .end();
            yield this.ensureIngressIsRunning();
        });
    }
    ensureCrdsApplied() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield this.controller.cluster
                .begin('Ensure resource definitions applied')
                .attempt(20, 2000, this.countCRDs.bind(this))
                .end();
        });
    }
    countCRDs(_, attempt) {
        var _a;
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let count = 0;
            const cluster = this.controller.cluster;
            yield cluster
                .begin()
                .list(this.crdDocument)
                .do((result) => {
                var _a, _b;
                count = (_b = (_a = result === null || result === void 0 ? void 0 : result.object) === null || _a === void 0 ? void 0 : _a.items) === null || _b === void 0 ? void 0 : _b.length;
            })
                .end();
            (_a = cluster.status) === null || _a === void 0 ? void 0 : _a.info(`Retrieved ${count} out of ${expectedCRDCount} CRDs attempt ${attempt}`);
            return count >= expectedCRDCount;
        });
    }
    ensureIngressIsRunning() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield this.controller.cluster
                .begin(`Ensure ingress gateway is running`)
                .beginWatch(this.ingressPod)
                .whenWatch(({ condition }) => condition.Ready == 'True', (processor) => {
                processor.endWatch();
            })
                .end();
        });
    }
    ensureIstiodIsRunning() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield this.controller.cluster
                .begin(`Ensure istiod is running`)
                .beginWatch(this.istiodPod)
                .whenWatch(({ condition }) => condition.Ready == 'True', (processor) => {
                processor.endWatch();
            })
                .end();
        });
    }
};
exports.createApplyMixin = createApplyMixin;
//# sourceMappingURL=createApply.js.map