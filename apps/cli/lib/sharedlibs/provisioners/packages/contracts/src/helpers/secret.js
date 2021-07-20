"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SecretHelper = void 0;
const kubeclient_contracts_1 = require("@c6o/kubeclient-contracts");
class SecretHelper extends kubeclient_contracts_1.ResourceHelper {
}
exports.SecretHelper = SecretHelper;
SecretHelper.from = (namespace, name) => new SecretHelper(SecretHelper.template(namespace, name));
SecretHelper.template = (namespace, name, data) => (Object.assign({ apiVersion: 'v1', kind: 'Secret', metadata: Object.assign(Object.assign({}, (name ? { name } : undefined)), (namespace ? { namespace } : undefined)) }, (data ? { data } : undefined)));
//# sourceMappingURL=secret.js.map