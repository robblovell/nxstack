"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteMixin = void 0;
const tslib_1 = require("tslib");
const deleteMixin = (base) => class extends base {
    constructor() {
        super();
    }
    deleteImplementation(request) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let persistentVolume;
            persistentVolume = yield this.getPersistentVolume(request.persistentVolumeName);
            yield this.setRetainPolicyToDelete(persistentVolume);
            return;
        });
    }
    setRetainPolicyToDelete(doc) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const result = yield this.cluster.patch(doc, [
                {
                    'op': 'replace',
                    'path': '/spec/persistentVolumeReclaimPolicy',
                    'value': 'Delete'
                }
            ]);
            result.throwIfError();
        });
    }
    getPersistentVolumeClaimFromVolume(namespace, appName, doc) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            throw new Error("deleteMixin::Not implemented: getPersistentVolumeClaimFromVolume");
        });
    }
};
exports.deleteMixin = deleteMixin;
//# sourceMappingURL=delete.js.map