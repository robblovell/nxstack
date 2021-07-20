"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatefulSetHelper = void 0;
const codezero_1 = require("../codezero");
class StatefulSetHelper extends codezero_1.CodeZeroHelper {
}
exports.StatefulSetHelper = StatefulSetHelper;
StatefulSetHelper.template = (namespace, name) => ({
    apiVersion: 'apps/v1',
    kind: 'StatefulSet',
    metadata: Object.assign(Object.assign({}, (name ? { name } : undefined)), (namespace ? { namespace } : undefined))
});
StatefulSetHelper.from = (namespace, name) => new StatefulSetHelper(StatefulSetHelper.template(namespace, name));
//# sourceMappingURL=statefulSet.js.map