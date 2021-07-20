"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PodHelper = void 0;
const codezero_1 = require("../codezero");
class PodHelper extends codezero_1.CodeZeroHelper {
}
exports.PodHelper = PodHelper;
PodHelper.template = (namespace, name) => ({
    apiVersion: 'v1',
    kind: 'Pod',
    metadata: Object.assign(Object.assign({}, (name ? { name } : undefined)), (namespace ? { namespace } : undefined))
});
PodHelper.from = (namespace, name) => new PodHelper(PodHelper.template(namespace, name));
//# sourceMappingURL=pod.js.map