"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkloadEnvMonitor = void 0;
const tslib_1 = require("tslib");
const logger_1 = require("@c6o/logger");
const common_1 = require("@provisioner/common");
const base_1 = require("./base");
const configMap_1 = require("./configMap");
const secret_1 = require("./secret");
const debug = logger_1.createDebug();
class WorkloadEnvMonitor extends base_1.EnvMonitor {
    shallowEqual(object1, object2) {
        const keys1 = Object.keys(object1);
        const keys2 = Object.keys(object2);
        if (keys1.length !== keys2.length) {
            return false;
        }
        for (const key of keys1) {
            if (object1[key] !== object2[key]) {
                return false;
            }
        }
        return true;
    }
    onAdded() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            this.envValues = common_1.WorkloadHelper.envToKeyValue(this.current.kind, this.current);
            const cmNames = common_1.WorkloadHelper.configMapRefs(this.current.kind, this.current);
            for (const cmName of cmNames)
                this.addChild(common_1.ConfigMapHelper.template(this.current.metadata.namespace, cmName));
            const secretNames = common_1.WorkloadHelper.secretRefs(this.current.kind, this.current);
            for (const secretName of secretNames)
                this.addChild(common_1.SecretHelper.template(this.current.metadata.namespace, secretName));
            return !cmNames.length && !secretNames.length;
        });
    }
    onModified() {
        const _super = Object.create(null, {
            reload: { get: () => super.reload }
        });
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const newEnvValues = common_1.WorkloadHelper.envToKeyValue(this.current.kind, this.current);
            const isDiff = this.shallowEqual(newEnvValues, this.envValues);
            this.envValues = newEnvValues;
            const cmNames = common_1.WorkloadHelper.configMapRefs(this.current.kind, this.current);
            const cmResources = cmNames.map(cmName => common_1.ConfigMapHelper.template(this.current.metadata.namespace, cmName));
            const secretNames = common_1.WorkloadHelper.secretRefs(this.current.kind, this.current);
            const secretResources = secretNames.map(secretName => common_1.SecretHelper.template(this.current.metadata.namespace, secretName));
            return isDiff || (yield _super.reload.call(this, ...cmResources, ...secretResources));
        });
    }
    monitorFactory(resource) {
        switch (resource.kind) {
            case 'ConfigMap':
                return configMap_1.ConfigMapEnvMonitor;
            case 'Secret':
                return secret_1.SecretEnvMonitor;
            default:
                return super.monitorFactory(resource);
        }
    }
}
exports.WorkloadEnvMonitor = WorkloadEnvMonitor;
//# sourceMappingURL=workload.js.map