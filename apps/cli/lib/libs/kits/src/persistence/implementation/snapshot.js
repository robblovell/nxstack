"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.snapshotMixin = void 0;
const tslib_1 = require("tslib");
const errors_1 = require("../errors");
const generators_1 = require("../generators");
const snapshotMixin = (base) => class extends base {
    constructor() {
        super();
    }
    snapshotImplementation(request) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const snapshot = generators_1.PersistenceGenerator.createSnapshotTemplate(request.namespace, request.persistentVolumeClaimName, request.volumeSnapshotClassName, request.volumeSnapshotName);
            const result = yield this.cluster.create(snapshot);
            result.throwIfError();
            return result;
        });
    }
    snapshotAllowedImplementation() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            throw new errors_1.PersistenceHelperError('Method not implemented.');
        });
    }
};
exports.snapshotMixin = snapshotMixin;
//# sourceMappingURL=snapshot.js.map