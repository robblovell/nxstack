"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prometheusApiMixin = void 0;
const tslib_1 = require("tslib");
const yaml = tslib_1.__importStar(require("js-yaml"));
const Handlebars = tslib_1.__importStar(require("handlebars"));
const path = tslib_1.__importStar(require("path"));
const fs_1 = require("fs");
const common_1 = require("@provisioner/common");
const prometheusApiMixin = (base) => class extends base {
    linkPrometheus(prometheusNamespace, istioNamespace) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield this.unlinkPrometheus(istioNamespace, false);
            yield this.controller.cluster.begin('Adding access for Prometheus')
                .upsertFile('../../../k8s/prometheus/prometheus-rbac.yaml', { istioNamespace, prometheusNamespace })
                .end();
            const prometheusProvisioner = yield this.controller.resolver.getProvisioner(prometheusNamespace, 'prometheus');
            yield prometheusProvisioner.beginConfig(prometheusNamespace, istioNamespace, 'istio');
            const jobs = yield this.loadYaml(path.resolve(__dirname, '../../../k8s/prometheus/jobs.yaml'), { istioNamespace });
            yield prometheusProvisioner.addJobs(jobs);
            yield prometheusProvisioner.endConfig();
        });
    }
    unlinkPrometheus(istioNamespace, clearLinkField = true) {
        var _a, _b;
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const clusterRole = {
                apiVersion: 'rbac.authorization.k8s.io/v1',
                kind: 'ClusterRole',
                metadata: {
                    name: `prometheus-${istioNamespace}`
                }
            };
            const clusterRoleBinding = {
                apiVersion: 'rbac.authorization.k8s.io/v1',
                kind: 'ClusterRoleBinding',
                metadata: {
                    name: `prometheus-${istioNamespace}`
                }
            };
            (_a = this.controller.status) === null || _a === void 0 ? void 0 : _a.push('Removing access for Prometheus');
            yield this.controller.cluster.delete(clusterRole);
            yield this.controller.cluster.delete(clusterRoleBinding);
            (_b = this.controller.status) === null || _b === void 0 ? void 0 : _b.pop();
            const prometheusApps = yield common_1.AppHelper.from(null, 'prometheus').list(this.controller.cluster, 'Failed to find Prometheus');
            for (const prometheusApp of prometheusApps) {
                const prometheusProvisioner = yield this.controller.resolver.getProvisioner(prometheusApp);
                const prometheusNamespace = prometheusApp.metadata.namespace;
                yield prometheusProvisioner.clearAll(prometheusNamespace, istioNamespace, 'istio');
            }
            if (clearLinkField)
                delete this.controller.resource.spec.provisioner['prometheus-link'];
        });
    }
    loadYaml(file, params) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const source = yield fs_1.promises.readFile(file, 'utf8');
            if (!params)
                return yaml.load(source);
            const template = Handlebars.compile(source, { noEscape: true });
            const content = template(params);
            return yaml.load(content);
        });
    }
};
exports.prometheusApiMixin = prometheusApiMixin;
//# sourceMappingURL=prometheus.js.map