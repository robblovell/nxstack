"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postAppMixin = void 0;
const tslib_1 = require("tslib");
const debug_1 = tslib_1.__importDefault(require("debug"));
const debug = debug_1.default('c6o-system:api:postAppMixin:');
const postAppMixin = (base) => class extends base {
    postCreateApp(app) {
        var _a, _b, _c;
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if ((_a = app.spec.routes) === null || _a === void 0 ? void 0 : _a.length) {
                (_b = this.controller.status) === null || _b === void 0 ? void 0 : _b.push(`Creating App ${app.metadata.namespace} routes`);
                const istioProvisioner = yield this.getIstioProvisioner();
                yield istioProvisioner.upsertVirtualService(app, 'c6o-system/' + this.SYSTEM_GATEWAY_NAME);
                (_c = this.controller.status) === null || _c === void 0 ? void 0 : _c.pop();
            }
        });
    }
    postRemoveApp(app) {
        var _a, _b, _c;
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if ((_a = app.spec.routes) === null || _a === void 0 ? void 0 : _a.length) {
                (_b = this.controller.status) === null || _b === void 0 ? void 0 : _b.push(`Removing App ${app.metadata.namespace} routes`);
                const istioProvisioner = yield this.getIstioProvisioner();
                yield istioProvisioner.removeVirtualService(app);
                (_c = this.controller.status) === null || _c === void 0 ? void 0 : _c.pop();
            }
        });
    }
    postUpdateApp(app) {
        var _a, _b, _c;
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if ((_a = app.spec.routes) === null || _a === void 0 ? void 0 : _a.length) {
                (_b = this.controller.status) === null || _b === void 0 ? void 0 : _b.push(`Updating App ${app.metadata.namespace} routes`);
                const istioProvisioner = yield this.getIstioProvisioner();
                yield istioProvisioner.upsertVirtualService(app, 'c6o-system/' + this.SYSTEM_GATEWAY_NAME);
                (_c = this.controller.status) === null || _c === void 0 ? void 0 : _c.pop();
            }
        });
    }
};
exports.postAppMixin = postAppMixin;
//# sourceMappingURL=postApp.js.map