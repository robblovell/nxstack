"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeploymentHelper = void 0;
const tslib_1 = require("tslib");
const contracts_1 = require("@provisioner/contracts");
const workload_1 = require("./workload");
class DeploymentHelper extends contracts_1.DeploymentHelper {
    restart(cluster) {
        var _a;
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const result = yield cluster.read(this.resource);
            result.throwIfError(`Failed to restart deployment ${this.name} in ${this.namespace}`);
            const deployment = result.as();
            const previousCount = (_a = deployment.spec) === null || _a === void 0 ? void 0 : _a.replicas;
            yield cluster.patch(deployment, { spec: { replicas: 0 } });
            yield cluster.patch(deployment, { spec: { replicas: previousCount } });
            return deployment;
        });
    }
    static containers(deployments, section) {
        return deployments.reduce((acc, deployment) => {
            return [...acc, ...deployment.spec.template.spec.containers.reduce((acc2, container) => {
                    if (section && container[section])
                        acc2.push(container[section]);
                    else if (!section)
                        acc2.push(container);
                    return acc2;
                }, [])];
        }, []);
    }
    static keyMapReferences(deployments) {
        const containers = DeploymentHelper.containers(deployments, 'envFrom');
        return containers ? containers.reduce((acc1, container) => {
            return container ? container.reduce((acc2, env) => {
                acc2.push(env);
                return acc2;
            }, acc1) : [];
        }, []) : [];
    }
    static toKeyValues(deployments, merge = {}) {
        return workload_1.WorkloadHelper.envToKeyValue('Deployment', deployments, merge);
    }
    toKeyValues(cluster, merge = {}) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const result = yield cluster.read(this.resource);
            result.throwIfError();
            this.resourceList = result.as();
            return DeploymentHelper.toKeyValues(result.object.items, yield merge);
        });
    }
    static ensurePodRunning(result, processor, message) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            result.throwIfError();
            const deploy = result.as();
            const podSpec = {
                kind: 'Pod',
                metadata: {
                    namespace: deploy.metadata.namespace,
                    labels: deploy.spec.selector.matchLabels
                }
            };
            yield processor.cluster.
                begin(message || `Ensure ${deploy.metadata.name} pod is running`)
                .beginWatch(podSpec)
                .whenWatch(({ condition }) => condition.Ready == 'True', (processor) => {
                processor.endWatch();
            })
                .end();
        });
    }
}
exports.DeploymentHelper = DeploymentHelper;
DeploymentHelper.from = (namespace, name) => new DeploymentHelper(contracts_1.DeploymentHelper.template(namespace, name));
//# sourceMappingURL=deployment.js.map