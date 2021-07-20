"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkloadHelper = void 0;
const jsonpath_plus_1 = require("jsonpath-plus");
const paths_1 = require("./paths");
class WorkloadHelper {
    static envToKeyValue(kind, workloads, merge = {}) {
        const envPath = paths_1.pathToEnv(kind);
        const path = `${WorkloadHelper.prefix(workloads)}${envPath}`;
        const envs = jsonpath_plus_1.JSONPath({ path, json: workloads });
        return envs.reduce((acc, env) => {
            acc[env.name] = env.value;
            return acc;
        }, merge);
    }
    static configMapRefs(kind, workloads) {
        const refsPath = paths_1.pathToConfigMapRefs(kind);
        const path = `${WorkloadHelper.prefix(workloads)}${refsPath}`;
        return jsonpath_plus_1.JSONPath({ path, json: workloads });
    }
    static secretRefs(kind, workloads) {
        const refsPath = paths_1.pathToSecretRefs(kind);
        const path = `${WorkloadHelper.prefix(workloads)}${refsPath}`;
        return jsonpath_plus_1.JSONPath({ path, json: workloads });
    }
}
exports.WorkloadHelper = WorkloadHelper;
WorkloadHelper.prefix = (workloads) => Array.isArray(workloads) ? '$[*]' : '$';
//# sourceMappingURL=helper.js.map