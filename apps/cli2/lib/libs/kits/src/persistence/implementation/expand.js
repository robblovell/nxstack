"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.expandMixin = void 0;
const tslib_1 = require("tslib");
const address_1 = require("../address");
const errors_1 = require("../errors");
const generators_1 = require("../generators");
const expandMixin = (base) => class extends base {
    constructor() {
        super();
    }
    expandImplementation(request) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let targetDoc = request.targetDoc;
            if (!targetDoc) {
                const pvcAddress = address_1.PersistenceAddress.toPersisentVolumeClaimAddress(request.namespace, request.persistentVolumeClaimName);
                const result = yield this.cluster.read(pvcAddress);
                result.throwIfError();
                targetDoc = result.as();
            }
            return yield this.expandObject(targetDoc, request.newSize, request.capacityUnit);
        });
    }
    expandObject(doc, newSize, capacityUnit = 'Gi') {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield this.validateExpand(doc, newSize, capacityUnit);
            const patchDoc = generators_1.PersistenceGenerator.toExpandEntry(newSize, capacityUnit);
            return yield this.cluster.patch(doc, patchDoc);
        });
    }
    expansionAllowedImplementation(request) {
        var _a, _b;
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (!request.storageClassName)
                return false;
            const scAddress = address_1.PersistenceAddress.toStorageClassAddress(request.storageClassName);
            const sc = yield this.cluster.read(scAddress);
            return !((_b = (_a = sc.object) === null || _a === void 0 ? void 0 : _a.spec) === null || _b === void 0 ? void 0 : _b.allowVolumeExpansion);
        });
    }
    validateExpand(doc, newSize, capacityUnit) {
        var _a, _b, _c, _d;
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (capacityUnit != 'Gi')
                throw new errors_1.PersistenceHelperError('Currently, the only supported capacity unit is "Gi"');
            if (newSize <= 1 || !Number.isInteger(newSize))
                throw new errors_1.PersistenceHelperError('The new capacity size must be given as an integer greater than 1');
            if (!((_c = (_b = (_a = doc.spec) === null || _a === void 0 ? void 0 : _a.resources) === null || _b === void 0 ? void 0 : _b.requests) === null || _c === void 0 ? void 0 : _c.storage))
                throw new errors_1.PersistenceHelperError('Volume created without a capacity.');
            if (newSize <= parseInt(doc.status.capacity.storage))
                throw new errors_1.PersistenceHelperError('Capacity must be an integer greater than its current size');
            if (!(yield this.expansionAllowed(doc.spec)))
                throw new errors_1.PersistenceHelperError('This volume cannot be expanded as the storage class provider does not support it');
            if ((_d = doc.status) === null || _d === void 0 ? void 0 : _d.conditions)
                throw new errors_1.PersistenceHelperError(`This volume cannot be expanded at the moment because there are pending operations: ${doc.status.conditions.map(({ type }) => type).join(', ')}`);
        });
    }
};
exports.expandMixin = expandMixin;
//# sourceMappingURL=expand.js.map