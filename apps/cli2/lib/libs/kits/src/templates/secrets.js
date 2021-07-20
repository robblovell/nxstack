"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSecretTemplate = void 0;
function getSecretTemplate(name, namespace, data) {
    return {
        apiVersion: 'v1',
        kind: 'Secret',
        metadata: {
            name: name ? `${name}-secret` : undefined,
            namespace: namespace
        },
        type: 'Opaque',
        data,
    };
}
exports.getSecretTemplate = getSecretTemplate;
//# sourceMappingURL=secrets.js.map