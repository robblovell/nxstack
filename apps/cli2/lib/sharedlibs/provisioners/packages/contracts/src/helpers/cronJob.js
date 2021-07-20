"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CronJobHelper = void 0;
const codezero_1 = require("../codezero");
class CronJobHelper extends codezero_1.CodeZeroHelper {
}
exports.CronJobHelper = CronJobHelper;
CronJobHelper.template = (namespace, name) => ({
    apiVersion: 'batch/v1beta1',
    kind: 'CronJob',
    metadata: Object.assign(Object.assign({}, (name ? { name } : undefined)), (namespace ? { namespace } : undefined))
});
CronJobHelper.from = (namespace, name) => new CronJobHelper(CronJobHelper.template(namespace, name));
//# sourceMappingURL=cronJob.js.map