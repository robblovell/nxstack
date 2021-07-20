"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gatewayApiMixin = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@provisioner/common");
const gatewayApiMixin = (base) => class extends base {
    constructor() {
        super(...arguments);
        this.gatewayTemplate = (namespace, name) => ({
            apiVersion: 'networking.istio.io/v1alpha3',
            kind: 'Gateway',
            metadata: {
                namespace,
                name
            },
            spec: {
                selector: {
                    istio: 'ingressgateway'
                },
                servers: undefined
            }
        });
    }
    findGateway(namespace, name) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.controller.cluster.read({
                apiVersion: 'networking.istio.io/v1alpha3',
                kind: 'Gateway',
                metadata: {
                    name,
                    namespace
                }
            });
        });
    }
    createGateway(namespace, name, servers) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let result = yield this.findGateway(namespace, name);
            if (result.object)
                return result;
            const template = this.gatewayTemplate(namespace, name);
            if (servers)
                template.spec.servers = servers;
            result = yield this.controller.cluster.upsert(template);
            if (result.object) {
                const refresher = this.gatewayTemplate('istio-system', 'bogus-gateway');
                yield this.controller.cluster.create(refresher);
                yield this.controller.cluster.delete(refresher);
            }
            return result;
        });
    }
    removeGateway(namespace, name) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const template = this.gatewayTemplate(namespace, name);
            return yield this.controller.cluster.delete(template);
        });
    }
    getExternalAddress() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield common_1.ServiceHelper
                .from('istio-system')
                .setLabel('istio', 'ingressgateway')
                .awaitAddress(this.controller.cluster, 'Fetching external address');
        });
    }
};
exports.gatewayApiMixin = gatewayApiMixin;
//# sourceMappingURL=gateway.js.map