"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KubernetesResourcesUI = void 0;
const tslib_1 = require("tslib");
const kubeclient_contracts_1 = require("@c6o/kubeclient-contracts");
const base_1 = require("../base");
const isNamespace = (ns) => {
    var _a;
    return !!((_a = ns) === null || _a === void 0 ? void 0 : _a.kind);
};
class KubernetesResourcesUI extends base_1.TerminalUI {
    static ensureResourceIdPrompts(helperFrom, params, namespaceOrNamespaceIdProp = 'namespace', resourceIdProp, filter = null) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let resources = null;
            return [{
                    type: 'list',
                    message: 'Please select one of the following',
                    name: resourceIdProp,
                    when: (answers) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                        if (params[resourceIdProp])
                            return false;
                        const namespace = answers[namespaceOrNamespaceIdProp];
                        const namespaceName = this.toNamespaceName(namespace);
                        const resourceId = helperFrom(namespaceName);
                        const result = yield params.cluster.list(resourceId);
                        result.throwIfError();
                        const helper = new kubeclient_contracts_1.ResourceHelper(result.object);
                        resources = filter ?
                            Array.from(helper.each(resourceId.kind)).filter(filter) :
                            Array.from(helper.each(resourceId.kind));
                        if (resources.length === 1)
                            answers[resourceIdProp] = kubeclient_contracts_1.toResourceId(resources[0]);
                        return resources.length > 1;
                    }),
                    choices: () => resources.map(resource => {
                        var _a;
                        return ({
                            name: (_a = resource.metadata) === null || _a === void 0 ? void 0 : _a.name,
                            value: kubeclient_contracts_1.toResourceId(resource)
                        });
                    }),
                    default: 0
                }];
        });
    }
}
exports.KubernetesResourcesUI = KubernetesResourcesUI;
KubernetesResourcesUI.toNamespaceName = (ns) => {
    var _a;
    return isNamespace(ns) ?
        (_a = ns.metadata) === null || _a === void 0 ? void 0 : _a.name :
        ns;
};
//# sourceMappingURL=resources.js.map