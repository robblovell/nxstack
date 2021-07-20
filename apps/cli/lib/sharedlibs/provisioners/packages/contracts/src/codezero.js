"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeZeroHelper = void 0;
const kubeclient_contracts_1 = require("@c6o/kubeclient-contracts");
class CodeZeroHelper extends kubeclient_contracts_1.ResourceHelper {
    get displayName() { var _a; return ((_a = this.resource.metadata.annotations) === null || _a === void 0 ? void 0 : _a['system.codezero.io/display']) || this.name; }
    get iconUrl() { var _a; return (_a = this.resource.metadata.annotations) === null || _a === void 0 ? void 0 : _a['system.codezero.io/iconUrl']; }
    get componentLabels() {
        return {
            'app.kubernetes.io/managed-by': 'codezero'
        };
    }
}
exports.CodeZeroHelper = CodeZeroHelper;
//# sourceMappingURL=codezero.js.map