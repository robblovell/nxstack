"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnvironmentNamespaceHelper = void 0;
const base_1 = require("./base");
class EnvironmentNamespaceHelper extends base_1.BaseNamespaceHelper {
    get type() { return 'environment'; }
    get typeDisplay() { return 'Environment'; }
}
exports.EnvironmentNamespaceHelper = EnvironmentNamespaceHelper;
EnvironmentNamespaceHelper.template = (name) => ({
    apiVersion: 'v1',
    kind: 'Namespace',
    metadata: Object.assign(Object.assign({}, (name ? { name } : undefined)), { labels: {
            'system.codezero.io/type': 'Environment'
        } })
});
//# sourceMappingURL=environment.js.map