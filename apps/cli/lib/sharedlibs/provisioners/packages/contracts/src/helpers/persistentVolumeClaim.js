"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PersistentVolumeClaimObject = void 0;
const codezero_1 = require("../codezero");
class PersistentVolumeClaimObject extends codezero_1.CodeZeroHelper {
    get volumeName() {
        return this.spec.volumeName;
    }
    get appName() {
        var _a;
        return (_a = this.metadata.ownerReferences[0]) === null || _a === void 0 ? void 0 : _a.name;
    }
}
exports.PersistentVolumeClaimObject = PersistentVolumeClaimObject;
//# sourceMappingURL=persistentVolumeClaim.js.map