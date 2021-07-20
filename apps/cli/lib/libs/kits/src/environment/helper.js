"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnvironmentHelper = void 0;
const tslib_1 = require("tslib");
const kubeclient_contracts_1 = require("@c6o/kubeclient-contracts");
class EnvironmentHelper extends kubeclient_contracts_1.ResourceHelper {
    constructor() {
        super(...arguments);
        this.template = (name) => ({
            apiVersion: 'v1',
            kind: 'Environment',
            metadata: Object.assign(Object.assign({}, (name ? { name } : undefined)), { labels: {
                    'system.codezero.io/type': 'environment'
                } })
        });
    }
    create(cluster, name) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const result = yield cluster.create(this.template(name));
            result.throwIfError(`Failed to create Environment ${name}`);
            return result.as();
        });
    }
    delete(cluster, name) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const result = yield cluster.delete(this.template(name));
            result.throwIfError(`Failed to delete Environment ${name}`);
            return result.as();
        });
    }
    list(cluster, page) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const result = yield cluster.list(this.template(), page);
            result.throwIfError('Failed to retrieve Environments');
            return result.each('Namespace');
        });
    }
}
exports.EnvironmentHelper = EnvironmentHelper;
//# sourceMappingURL=helper.js.map