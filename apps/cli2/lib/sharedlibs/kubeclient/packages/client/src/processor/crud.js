"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.crudMixin = void 0;
const tslib_1 = require("tslib");
const object_merge_advanced_1 = require("object-merge-advanced");
const crudMixin = (base) => class crudMixinImp extends base {
    mergeWith(document) {
        this.do(() => { this.mergeDocument = document; });
        return this;
    }
    clearMergeWith() {
        this.do(() => { delete this.mergeDocument; });
        return this;
    }
    addOwner(document) {
        this.do(() => {
            if (this.owners)
                this.owners.push(document);
            else
                this.owners = [document];
        });
        return this;
    }
    clearOwners() {
        this.do(() => { delete this.owners; });
        return this;
    }
    list(document) {
        this.do(() => this.cluster.list(document));
        return this;
    }
    read(document) {
        this.do(() => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const result = yield this.cluster.read(document);
            result.suppress = result.errorCode == 404;
            return result;
        }));
        return this;
    }
    create(document) {
        this.do(() => {
            var _a;
            if (this.mergeDocument)
                document = object_merge_advanced_1.mergeAdvanced(document, this.mergeDocument, null);
            return this.cluster.create(document, (_a = this.owners) === null || _a === void 0 ? void 0 : _a.slice());
        });
        return this;
    }
    patch(document, patch) {
        this.do(() => this.cluster.patch(document, patch));
        return this;
    }
    delete(document) {
        this.do(() => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const result = yield this.cluster.delete(document);
            result.suppress = result.errorCode == 404;
            return result;
        }));
        return this;
    }
    upsert(document) {
        this.do(() => {
            var _a;
            if (this.mergeDocument)
                document = object_merge_advanced_1.mergeAdvanced(document, this.mergeDocument, null);
            return this.cluster.upsert(document, (_a = this.owners) === null || _a === void 0 ? void 0 : _a.slice());
        });
        return this;
    }
};
exports.crudMixin = crudMixin;
//# sourceMappingURL=crud.js.map