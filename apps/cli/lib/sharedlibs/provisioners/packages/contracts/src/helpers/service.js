"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceHelper = void 0;
const kubeclient_contracts_1 = require("@c6o/kubeclient-contracts");
class ServiceHelper extends kubeclient_contracts_1.ResourceHelper {
}
exports.ServiceHelper = ServiceHelper;
ServiceHelper.template = (namespace, name) => ({
    apiVersion: 'v1',
    kind: 'Service',
    metadata: Object.assign(Object.assign({}, (name ? { name } : undefined)), (namespace ? { namespace } : undefined))
});
ServiceHelper.from = (namespace, name) => new ServiceHelper(ServiceHelper.template(namespace, name));
//# sourceMappingURL=service.js.map