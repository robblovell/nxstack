"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseNamespaceHelper = void 0;
const tslib_1 = require("tslib");
const kubeclient_contracts_1 = require("@c6o/kubeclient-contracts");
class BaseNamespaceHelper extends kubeclient_contracts_1.ResourceHelper {
    constructor() {
        super(...arguments);
        this.isType = (namespace) => { var _a, _b; return ((_b = (_a = namespace.metadata) === null || _a === void 0 ? void 0 : _a.labels) === null || _b === void 0 ? void 0 : _b['system.codezero.io/type']) === this.type; };
        this.makeType = (namespace) => {
            namespace.metadata.labels = Object.assign(Object.assign({}, namespace.metadata.labels), { 'system.codezero.io/type': this.type });
            return namespace;
        };
        this.template = (name) => ({
            apiVersion: 'v1',
            kind: 'Namespace',
            metadata: Object.assign(Object.assign({}, (name ? { name } : undefined)), { labels: {
                    'system.codezero.io/type': this.type
                } })
        });
    }
    get(cluster, name) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const result = yield cluster.read(this.template(name));
            result.throwIfError(`Failed to retrieve ${this.typeDisplay} ${name}`);
            return result.as();
        });
    }
    list(cluster, page) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const result = yield cluster.list(this.template(), page);
            result.throwIfError(`Failed to retrieve ${this.typeDisplay}`);
            return result.each('Namespace');
        });
    }
    find(cluster, page) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const result = yield cluster.list(this.template(), page);
            result.throwIfError(`Failed to retrieve ${this.typeDisplay}`);
            return result.as();
        });
    }
    upsert(cluster, name) {
        var _a, _b;
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const namespace = this.template(name);
            const result = yield cluster.read(namespace);
            if (result.errorCode === '404')
                return this.create(cluster, name);
            const exitingNS = result.as();
            if (this.isType(exitingNS))
                return exitingNS;
            const type = (_b = (_a = exitingNS.metadata) === null || _a === void 0 ? void 0 : _a.labels) === null || _b === void 0 ? void 0 : _b['system.codezero.io/type'];
            if (type !== undefined && type !== this.type)
                throw new Error(`Namespace ${name} is of type ${type} can can't be set to ${this.type}`);
            const patchResult = yield cluster.patch(exitingNS, this.makeType(exitingNS));
            patchResult.throwIfError(`Failed to make Namespace ${exitingNS.metadata.name} an Environment`);
            return patchResult.as();
        });
    }
    create(cluster, name) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const result = yield cluster.create(this.template(name));
            result.throwIfError(`Failed to create ${this.typeDisplay} ${name}`);
            return result.as();
        });
    }
    delete(cluster, name) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const result = yield cluster.delete(this.template(name));
            result.throwIfError(`Failed to delete ${this.typeDisplay} ${name}`);
            return result.as();
        });
    }
}
exports.BaseNamespaceHelper = BaseNamespaceHelper;
//# sourceMappingURL=base.js.map