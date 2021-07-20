"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KubernetesResources = void 0;
const tslib_1 = require("tslib");
const kubeclient_contracts_1 = require("@c6o/kubeclient-contracts");
const ui_1 = require("../../ui");
class KubernetesResources {
    static ensureResourceId(params, helperFrom, nameProp, resourceIdProp, namespaceOrNamespaceIdProp = 'namespace', filter = null) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (params[resourceIdProp])
                return;
            const namespaceName = ui_1.KubernetesResourcesUI.toNamespaceName(params[namespaceOrNamespaceIdProp]);
            const name = params[nameProp];
            const resourceId = helperFrom(namespaceName, name);
            if (name) {
                const result = yield params.cluster.read(resourceId);
                result.throwIfError();
                params[resourceIdProp] = kubeclient_contracts_1.toResourceId(result.object);
            }
            else {
                return ui_1.KubernetesResourcesUI.ensureResourceIdPrompts(helperFrom, params, namespaceOrNamespaceIdProp, resourceIdProp, filter);
            }
        });
    }
}
exports.KubernetesResources = KubernetesResources;
//# sourceMappingURL=resources.js.map