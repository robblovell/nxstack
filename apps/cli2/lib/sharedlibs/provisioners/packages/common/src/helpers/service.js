"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceHelper = void 0;
const tslib_1 = require("tslib");
const contracts_1 = require("@provisioner/contracts");
class ServiceHelper extends contracts_1.ServiceHelper {
    awaitAddress(cluster, waitingMessage) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let ip = null;
            let hostname = null;
            yield cluster.
                begin(waitingMessage)
                .beginWatch(this.resource)
                .whenWatch(({ obj }) => { var _a, _b, _c, _d, _e, _f, _g; return ((_c = (_b = (_a = obj.status) === null || _a === void 0 ? void 0 : _a.loadBalancer) === null || _b === void 0 ? void 0 : _b.ingress) === null || _c === void 0 ? void 0 : _c.length) && (((_e = (_d = obj.status) === null || _d === void 0 ? void 0 : _d.loadBalancer) === null || _e === void 0 ? void 0 : _e.ingress[0].ip) || ((_g = (_f = obj.status) === null || _f === void 0 ? void 0 : _f.loadBalancer) === null || _g === void 0 ? void 0 : _g.ingress[0].hostname)); }, (processor, service) => {
                ip = service.status.loadBalancer.ingress[0].ip;
                hostname = service.status.loadBalancer.ingress[0].hostname;
                processor.endWatch();
            })
                .end();
            return { ip, hostname };
        });
    }
}
exports.ServiceHelper = ServiceHelper;
ServiceHelper.from = (namespace, name) => new ServiceHelper(contracts_1.ServiceHelper.template(namespace, name));
//# sourceMappingURL=service.js.map