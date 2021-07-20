"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Teleport = void 0;
const tslib_1 = require("tslib");
const contracts_1 = require("@provisioner/contracts");
const kubefwd_1 = require("@c6o/kubefwd");
const services_1 = require("../services");
const base_1 = require("./base");
const kubernetes_1 = require("./kubernetes");
class Teleport extends base_1.Orchestrator {
    constructor() {
        super(...arguments);
        this.filteredNamespaces = ['c6o-seed', 'c6o-system', 'istio-system', 'kube-node-lease', 'kube-public', 'kube-system'];
    }
    apply() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let templateFrom;
            switch (this.params.kind) {
                case 'CronJob':
                    templateFrom = contracts_1.CronJobHelper.template;
                    break;
                case 'Deployment':
                    templateFrom = contracts_1.DeploymentHelper.template;
                    break;
                case 'Job':
                    templateFrom = contracts_1.JobHelper.template;
                    break;
                case 'Namespace':
                    templateFrom = contracts_1.NamespaceHelper.template;
                    break;
                case 'Pod':
                    templateFrom = contracts_1.PodHelper.template;
                    break;
                case 'StatefulSet':
                    templateFrom = contracts_1.StatefulSetHelper.template;
                    break;
            }
            this.params = yield this.UI.prompt(yield this.ensureKubefwd(), yield kubernetes_1.Kubernetes.ensureCluster(this.params), yield kubernetes_1.KubernetesResources.ensureResourceId(this.params, contracts_1.NamespaceHelper.template, 'namespace', 'namespaceResourceId', 'namespace', n => !this.filteredNamespaces.includes(n.metadata.name)), this.params.kind === 'Deployment' ? yield kubernetes_1.KubernetesResources.ensureResourceId(this.params, templateFrom, 'resourceName', 'resourceQuery', 'namespaceResourceId', n => !this.filteredNamespaces.includes(n.metadata.name)) : undefined);
            this.params.namespace = this.params.namespaceResourceId.metadata.name;
            const teleport = new services_1.Teleport(this.params);
            yield teleport.perform('Teleport');
        });
    }
    ensureKubefwd() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (!(yield kubefwd_1.hasKubefwd())) {
                if (process.getuid() === 0) {
                    yield kubefwd_1.installKubefwd();
                }
                else {
                    throw new Error('Teleport is not fully initialized yet.\nTry: \'sudo czctl init\'');
                }
            }
        });
    }
}
exports.Teleport = Teleport;
//# sourceMappingURL=teleport.js.map