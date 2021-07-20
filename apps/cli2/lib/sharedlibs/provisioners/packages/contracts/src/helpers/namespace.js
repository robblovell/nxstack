"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NamespaceHelper = void 0;
const kubeclient_contracts_1 = require("@c6o/kubeclient-contracts");
class NamespaceHelper extends kubeclient_contracts_1.ResourceHelper {
}
exports.NamespaceHelper = NamespaceHelper;
NamespaceHelper.template = (name) => ({
    apiVersion: 'v1',
    kind: 'Namespace',
    metadata: Object.assign({}, (name ? { name } : undefined))
});
NamespaceHelper.from = (name) => new NamespaceHelper(NamespaceHelper.template(name));
//# sourceMappingURL=namespace.js.map