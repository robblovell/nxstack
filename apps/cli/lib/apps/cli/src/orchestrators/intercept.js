"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Intercept = void 0;
const tslib_1 = require("tslib");
const logger_1 = require("@c6o/logger");
const contracts_1 = require("@provisioner/contracts");
const services_1 = require("../services");
const base_1 = require("./base");
const kubernetes_1 = require("./kubernetes");
const debug = logger_1.createDebug();
class Intercept extends base_1.Orchestrator {
    constructor() {
        super(...arguments);
        this.filteredNamespaces = ['c6o-seed', 'c6o-system', 'istio-system', 'kube-node-lease', 'kube-public', 'kube-system'];
    }
    apply() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            this.params = yield this.UI.prompt(yield kubernetes_1.Kubernetes.ensureCluster(this.params), yield kubernetes_1.KubernetesResources.ensureResourceId(this.params, contracts_1.NamespaceHelper.template, 'namespace', 'namespaceResourceId', 'namespace', n => !this.filteredNamespaces.includes(n.metadata.name)), yield kubernetes_1.KubernetesResources.ensureResourceId(this.params, contracts_1.ServiceHelper.template, 'remoteService', 'remoteServiceResourceId', 'namespaceResourceId'), yield Intercept.ensureServicePort(this.params));
            this.params.namespace = this.params.namespaceResourceId.metadata.name;
            this.params.remoteService = this.params.remoteServiceResourceId.metadata.name;
            debug('pre-flight params %o', this.params);
            const service = new services_1.Interceptor(this.params);
            yield service.perform('Intercept');
        });
    }
    static ensureServicePort(params) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return [{
                    type: 'list',
                    message: 'Select one of the following service ports',
                    name: 'remotePort',
                    when: (answers) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                        const result = yield params.cluster.read(answers.remoteServiceResourceId);
                        result.throwIfError();
                        if (result.object.spec.ports.length === 1)
                            answers.remotePort = result.object.spec.ports[0].port;
                        return result.object.spec.ports.length > 1;
                    }),
                    choices: (answers) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                        const result = yield params.cluster.read(answers.remoteServiceResourceId);
                        return result.object.spec.ports.map(port => ({
                            name: port.port,
                            value: port.port
                        }));
                    }),
                    default: (answers) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                        const result = yield params.cluster.read(answers.remoteServiceResourceId);
                        return result.object.spec.ports[0].port;
                    })
                }];
        });
    }
}
exports.Intercept = Intercept;
//# sourceMappingURL=intercept.js.map