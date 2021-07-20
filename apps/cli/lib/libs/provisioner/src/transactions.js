"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionHelper = void 0;
const tslib_1 = require("tslib");
const contracts_1 = require("@provisioner/contracts");
const assignDeep = tslib_1.__importStar(require("assign-deep"));
const jsonpatch = tslib_1.__importStar(require("fast-json-patch"));
class TransactionHelper {
    constructor(adapter) {
        this.adapter = adapter;
        this.removeUnset = (obj) => {
            Object.keys(obj).forEach(k => (obj[k] && typeof obj[k] === 'object') && this.removeUnset(obj[k]) ||
                (obj[k] === '$unset') && delete obj[k]);
            return obj;
        };
    }
    beginTransaction() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const current = yield this.adapter.cluster.read(this.adapter.resource);
            if (current.object) {
                this.preApplyDocument = jsonpatch.deepClone(current.object);
                this.adapter.resource = assignDeep(current.object, this.adapter.resource);
            }
            yield this.adapter.toPending(this.adapter.resource);
            contracts_1.clearDocumentSignal(this.adapter.resource);
            const result = this.adapter.resource.metadata.resourceVersion ?
                yield this.adapter.cluster.put(this.adapter.resource, this.adapter.resource) :
                yield this.adapter.cluster.create(this.adapter.resource);
            result.throwIfError();
            this.adapter.resource = result.as();
            return true;
        });
    }
    endTransaction() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let diffs = [];
            if (this.preApplyDocument) {
                this.removeUnset = this.removeUnset(this.adapter.resource.spec);
                diffs = jsonpatch.compare(this.preApplyDocument, this.adapter.resource);
                diffs = diffs.filter(diff => diff.path !== `/metadata/annotations/${contracts_1.DOCUMENT_SIGNAL_JSON_PATCH}` && (diff.path.startsWith('/spec/provisioner') ||
                    diff.path.startsWith('/metadata/annotations') ||
                    diff.path.startsWith('/metadata/labels') ||
                    diff.path.startsWith('/metadata/finalizers')));
            }
            const completeOp = yield this.adapter.toComplete(this.adapter.resource);
            diffs.push(completeOp);
            const result = yield this.adapter.cluster.patch(this.adapter.resource, diffs);
            result.throwIfError();
            this.adapter.resource = result.as();
        });
    }
    errorTransaction() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const errorPatch = yield this.adapter.toError(this.adapter.resource);
            const result = yield this.adapter.cluster.patch(this.adapter.resource, errorPatch);
            result.throwIfError();
            this.adapter.resource = result.as();
        });
    }
}
exports.TransactionHelper = TransactionHelper;
//# sourceMappingURL=transactions.js.map