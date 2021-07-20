"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobHelper = void 0;
const codezero_1 = require("../codezero");
class JobHelper extends codezero_1.CodeZeroHelper {
}
exports.JobHelper = JobHelper;
JobHelper.template = (namespace, name) => ({
    apiVersion: 'batch/v1',
    kind: 'Job',
    metadata: Object.assign(Object.assign({}, (name ? { name } : undefined)), (namespace ? { namespace } : undefined))
});
JobHelper.from = (namespace, name) => new JobHelper(JobHelper.template(namespace, name));
//# sourceMappingURL=job.js.map