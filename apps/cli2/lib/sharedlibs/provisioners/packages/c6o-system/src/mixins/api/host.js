"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hostApiMixin = void 0;
const tslib_1 = require("tslib");
const hostApiMixin = (base) => class extends base {
    getSystemFQDN() {
        var _a, _b;
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const result = yield this.controller.cluster.read(this.systemServerConfigMap('c6o-system'));
            result.throwIfError();
            const host = (_b = (_a = result.as()) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.HOST;
            if (!host)
                throw new Error('HOST not found');
            return host;
        });
    }
    getApplicationFQDN(appName, namespace) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const host = this.getSystemFQDN();
            const provisioner = yield this.getIstioProvisioner();
            const prefix = yield provisioner.getApplicationPrefix(appName, namespace);
            return `${prefix}.${host}`;
        });
    }
    getApplicationURL(appName, namespace) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const appFQDN = yield this.getApplicationFQDN(appName, namespace);
            return `https://${appFQDN}`;
        });
    }
};
exports.hostApiMixin = hostApiMixin;
//# sourceMappingURL=host.js.map