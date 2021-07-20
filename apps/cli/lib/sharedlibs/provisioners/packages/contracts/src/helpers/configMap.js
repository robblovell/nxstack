"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigMapHelper = void 0;
const kubeclient_contracts_1 = require("@c6o/kubeclient-contracts");
class ConfigMapHelper extends kubeclient_contracts_1.ResourceHelper {
}
exports.ConfigMapHelper = ConfigMapHelper;
ConfigMapHelper.from = (namespace, name) => new ConfigMapHelper(ConfigMapHelper.template(namespace, name));
ConfigMapHelper.template = (namespace, name, data) => (Object.assign({ apiVersion: 'v1', kind: 'ConfigMap', metadata: Object.assign(Object.assign({}, (name ? { name } : undefined)), (namespace ? { namespace } : undefined)) }, (data ? { data } : undefined)));
//# sourceMappingURL=configMap.js.map