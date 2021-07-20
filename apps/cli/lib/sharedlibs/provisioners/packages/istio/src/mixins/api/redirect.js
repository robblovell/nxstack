"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.httpsRedirectApiMixin = void 0;
const tslib_1 = require("tslib");
const httpsRedirectApiMixin = (base) => class extends base {
    constructor() {
        super(...arguments);
        this['https-redirect'] = {
            find: () => tslib_1.__awaiter(this, void 0, void 0, function* () {
                var _a, _b, _c, _d, _e;
                const result = yield this.findGateway();
                if (result.error)
                    return result.error;
                return { enable: (_e = (_d = (_c = (_b = (_a = result.object) === null || _a === void 0 ? void 0 : _a.spec) === null || _b === void 0 ? void 0 : _b.servers) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.tls) === null || _e === void 0 ? void 0 : _e.httpsRedirect };
            }),
            create: (data) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                const result = yield this.setHttpsRedirect(data.enable);
                return result.object || result.error;
            })
        };
        this.gateway = {
            apiVersion: 'networking.istio.io/v1alpha3',
            kind: 'Gateway',
            metadata: {
                name: 'system-gateway',
                namespace: 'c6o-system'
            }
        };
    }
    findGateway() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.controller.cluster.read(this.gateway);
        });
    }
    setHttpsRedirect(enable) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.controller.cluster.patch(this.gateway, [{ 'op': 'replace', 'path': '/spec/servers/0/tls/httpsRedirect', 'value': enable }]);
        });
    }
};
exports.httpsRedirectApiMixin = httpsRedirectApiMixin;
//# sourceMappingURL=redirect.js.map