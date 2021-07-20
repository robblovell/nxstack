"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProvisionerBase = exports.ProvisionerBasePrivate = void 0;
const tslib_1 = require("tslib");
const mixwith_1 = require("mixwith");
const path = tslib_1.__importStar(require("path"));
const fs_1 = require("fs");
const contracts_1 = require("@provisioner/contracts");
const mixins_1 = require("./mixins");
class ProvisionerBasePrivate {
}
exports.ProvisionerBasePrivate = ProvisionerBasePrivate;
const provisionerBaseMixin = mixwith_1.mix(ProvisionerBasePrivate).with(mixins_1.optionsMixin);
class ProvisionerBase extends provisionerBaseMixin {
    get edition() { var _a, _b, _c; return (_c = (_b = (_a = this.controller) === null || _a === void 0 ? void 0 : _a.resource) === null || _b === void 0 ? void 0 : _b.metadata) === null || _c === void 0 ? void 0 : _c.labels['system.codezero.io/edition']; }
    get documentHelper() {
        if (this._documentHelper)
            return this._documentHelper;
        if (!this.controller.resource)
            return;
        return this._documentHelper = new contracts_1.AppHelper(this.controller.resource);
    }
    help(command, options, messages) {
    }
    serve(req, res, serverRoot = 'lib/ui') {
        const root = path.resolve(this.moduleLocation, serverRoot);
        res.sendFile(req.url, { root });
    }
    serveApi(req, res) {
        var _a, _b;
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const routes = (_a = this.routes) === null || _a === void 0 ? void 0 : _a.call(this);
            const resource = routes[req.url.toLowerCase()];
            let routeFunction;
            switch (req.method) {
                case 'GET':
                    routeFunction = resource === null || resource === void 0 ? void 0 : resource.get;
                    break;
                case 'POST':
                    routeFunction = resource === null || resource === void 0 ? void 0 : resource.post;
                    break;
                case 'PUT':
                    routeFunction = resource === null || resource === void 0 ? void 0 : resource.put;
                    break;
                case 'DELETE':
                    routeFunction = resource === null || resource === void 0 ? void 0 : resource.delete;
                    break;
            }
            if (routeFunction) {
                const response = yield ((_b = routeFunction.func) === null || _b === void 0 ? void 0 : _b.apply(this, routeFunction === null || routeFunction === void 0 ? void 0 : routeFunction.params(req.query, req.body)));
                if (response)
                    res.json(response);
            }
            throw Error('Function not found');
        });
    }
    readFile(...args) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const buffer = yield fs_1.promises.readFile(path.resolve(...args));
            return buffer.toString('utf-8');
        });
    }
    getIngressGatewayServiceClusterIp() {
        var _a, _b, _c;
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const service = {
                apiVersion: 'v1',
                kind: 'Service',
                metadata: {
                    namespace: 'istio-system',
                    name: 'istio-ingressgateway',
                    labels: {
                        app: 'istio-ingressgateway'
                    }
                }
            };
            const result = yield this.controller.cluster.read(service);
            if (result.error) {
                (_a = this.logger) === null || _a === void 0 ? void 0 : _a.error(result.error);
                throw result.error;
            }
            return (_c = (_b = result.object) === null || _b === void 0 ? void 0 : _b.spec) === null || _c === void 0 ? void 0 : _c.clusterIP;
        });
    }
}
exports.ProvisionerBase = ProvisionerBase;
//# sourceMappingURL=provisioner.js.map