"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StorageClassHelper = void 0;
const tslib_1 = require("tslib");
const kubeclient_contracts_1 = require("@c6o/kubeclient-contracts");
const STORAGE_CLASS_DOCUMENT = {
    apiVersion: 'storage.k8s.io/v1',
    kind: 'StorageClass'
};
class StorageClassHelper extends kubeclient_contracts_1.ResourceHelper {
}
exports.StorageClassHelper = StorageClassHelper;
StorageClassHelper.template = (name) => ({
    apiVersion: 'storage.k8s.io/v1',
    kind: 'StorageClass',
    metadata: Object.assign({}, (name ? { name } : undefined))
});
StorageClassHelper.from = (name) => new StorageClassHelper(StorageClassHelper.template(name));
StorageClassHelper.inquire = (cluster, options) => {
    let choices = [];
    const storageClassWhen = (answers) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        const result = yield cluster.list(STORAGE_CLASS_DOCUMENT);
        const length = (_b = (_a = result.object) === null || _a === void 0 ? void 0 : _a.items) === null || _b === void 0 ? void 0 : _b.length;
        if (length > 0) {
            choices = result.object.items.map(sc => sc.metadata.name);
            if (length > 1)
                return true;
            answers[options.name] = choices[0];
        }
        return false;
    });
    return Object.assign(Object.assign({ message: 'What storage class would you like to use?' }, options), { type: 'list', when: storageClassWhen, choices: () => choices });
};
StorageClassHelper.getDefault = (cluster) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const result = yield cluster.list(STORAGE_CLASS_DOCUMENT);
    if (((_b = (_a = result === null || result === void 0 ? void 0 : result.object) === null || _a === void 0 ? void 0 : _a.items) === null || _b === void 0 ? void 0 : _b.length) === 1)
        return (_c = result.object.items[0].metadata) === null || _c === void 0 ? void 0 : _c.name;
});
//# sourceMappingURL=storageClass.js.map