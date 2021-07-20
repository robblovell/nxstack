"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppHelper = void 0;
const tslib_1 = require("tslib");
const contracts_1 = require("@provisioner/contracts");
const APP_DOCUMENT = {
    apiVersion: 'system.codezero.io/v1',
    kind: 'App'
};
class AppHelper extends contracts_1.AppHelper {
    read(cluster, errorMessage) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const result = yield cluster.read(this.resource);
            result.throwIfError(errorMessage);
            return result.as();
        });
    }
    list(cluster, errorMessage) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const result = !this.name ?
                yield cluster.list(this.resource) :
                yield cluster.list(this.resource, { fieldSelector: `metadata.name=${this.name}` });
            result.throwIfError(errorMessage);
            return Array.from(result.each('App'));
        });
    }
    static byInterface(cluster, interfaceName, errorMessage) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const result = yield cluster.list(Object.assign(Object.assign({}, APP_DOCUMENT), { metadata: {
                    labels: {
                        [`system.codezero.io/interface-${interfaceName}`]: 'true'
                    }
                } }));
            result.throwIfError(errorMessage);
            return Array.from(result.each('App'));
        });
    }
}
exports.AppHelper = AppHelper;
AppHelper.template = (namespace, name) => ({
    apiVersion: 'system.codezero.io/v1',
    kind: 'App',
    metadata: Object.assign(Object.assign({}, (name ? { name } : undefined)), (namespace ? { namespace } : undefined))
});
AppHelper.from = (namespace, name) => {
    const template = AppHelper.template(namespace, name);
    return new AppHelper(template);
};
//# sourceMappingURL=app.js.map