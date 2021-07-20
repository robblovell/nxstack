"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getServiceTemplate = void 0;
function getServiceTemplate(name, namespace, ports) {
    return {
        apiVersion: 'v1',
        kind: 'Service',
        metadata: {
            name,
            namespace: namespace
        },
        spec: {
            type: 'NodePort',
            ports,
            selector: { app: name }
        }
    };
}
exports.getServiceTemplate = getServiceTemplate;
//# sourceMappingURL=services.js.map