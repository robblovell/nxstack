"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConfigTemplate = void 0;
function getConfigTemplate(name, namespace, data) {
    return {
        apiVersion: 'v1',
        kind: 'ConfigMap',
        metadata: {
            name: name ? `${name}-config` : undefined,
            namespace: namespace
        },
        data,
    };
}
exports.getConfigTemplate = getConfigTemplate;
//# sourceMappingURL=configs.js.map