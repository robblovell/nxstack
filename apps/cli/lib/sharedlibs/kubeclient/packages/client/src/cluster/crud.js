"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.crudMixin = void 0;
const tslib_1 = require("tslib");
const kubeclient_contracts_1 = require("@c6o/kubeclient-contracts");
const crudMixin = (base) => class extends base {
    list(document, options = {}) {
        var _a, _b;
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const address = yield this.toAddress(document);
            const { table } = options, query = tslib_1.__rest(options, ["table"]);
            const qs = options.limit ? Object.assign({}, query) : Object.assign({ limit: 500 }, query);
            const headers = (options === null || options === void 0 ? void 0 : options.table) ? { Accept: 'application/json;as=Table;v=v1beta1;g=meta.k8s.io, application/json' } : undefined;
            (_a = this.status) === null || _a === void 0 ? void 0 : _a.info(`Getting all ${this.toString(document)}`);
            return yield kubeclient_contracts_1.Result.from(this.request.get(address.endpoint, { qs, headers, labelSelector: (_b = document.metadata) === null || _b === void 0 ? void 0 : _b.labels }));
        });
    }
    read(document, options = {}) {
        var _a;
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const address = yield this.toAddress(document);
            (_a = this.status) === null || _a === void 0 ? void 0 : _a.info(`Getting ${this.toString(document)}`);
            return yield kubeclient_contracts_1.Result.from(this.request.get(address.url, options));
        });
    }
    create(document, owners, options) {
        var _a;
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const address = yield this.toAddress(document);
            if (owners) {
                const ownerReferences = owners.reduce((accum, owner) => {
                    if ((owner.metadata.namespace !== document.metadata.namespace) &&
                        (!owner.metadata.namespace || !document.metadata.namespace))
                        return accum;
                    if (owner.metadata.namespace !== document.metadata.namespace)
                        throw new Error(`Owner is in namespace ${owner.metadata.namespace} but document is in ${document.metadata.namespace}`);
                    accum.push({
                        apiVersion: owner.apiVersion,
                        kind: owner.kind,
                        name: owner.metadata.name,
                        uid: owner.metadata.uid,
                        blockOwnerDeletion: true
                    });
                    return accum;
                }, []);
                document.metadata.ownerReferences = ownerReferences;
            }
            (_a = this.status) === null || _a === void 0 ? void 0 : _a.info(`Creating ${this.toString(document)}`);
            return yield kubeclient_contracts_1.Result.from(this.request.post(address.endpoint, document, options));
        });
    }
    put(document, newDoc, params) {
        var _a;
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const address = yield this.toAddress(document);
            const url = (params === null || params === void 0 ? void 0 : params.subResource) ? address.url + params.subResource : address.url;
            (_a = this.status) === null || _a === void 0 ? void 0 : _a.info(`Putting ${this.toString(document)}`);
            return yield kubeclient_contracts_1.Result.from(this.request.put(url, newDoc));
        });
    }
    patch(document, patch, options) {
        var _a;
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const address = yield this.toAddress(document);
            (_a = this.status) === null || _a === void 0 ? void 0 : _a.info(`Patching ${this.toString(document)}`);
            return yield kubeclient_contracts_1.Result.from(this.request.patch(address.url, patch, options));
        });
    }
    delete(document) {
        var _a;
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const address = yield this.toAddress(document);
            (_a = this.status) === null || _a === void 0 ? void 0 : _a.info(`Deleting ${this.toString(document)}`);
            return yield kubeclient_contracts_1.Result.from(this.request.delete(address.url));
        });
    }
    upsert(document, owners) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const result = yield this.read(document);
            return result.error && result.errorCode == 404 ?
                yield this.create(document, owners) :
                yield this.patch(document, document);
        });
    }
};
exports.crudMixin = crudMixin;
//# sourceMappingURL=crud.js.map