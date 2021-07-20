"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.watchMixin = void 0;
const tslib_1 = require("tslib");
const kubeclient_contracts_1 = require("@c6o/kubeclient-contracts");
const watchMixin = (base) => class extends base {
    watch(document, callback, done) {
        var _a, _b;
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const address = yield this.toAddress(document);
            const description = this.toString(document);
            (_a = this.status) === null || _a === void 0 ? void 0 : _a.info(`Watching ${description}`);
            const options = ((_b = document.metadata) === null || _b === void 0 ? void 0 : _b.labels) ? { labelSelector: document.metadata.labels } : {};
            const watchRequest = yield this.request.watch(address.watchEndpoint, options, callback, done);
            return new kubeclient_contracts_1.Result({
                request: watchRequest,
                disposer: () => {
                    var _a;
                    watchRequest.abort();
                    (_a = this.status) === null || _a === void 0 ? void 0 : _a.info(`Completed watching ${description}`);
                }
            });
        });
    }
};
exports.watchMixin = watchMixin;
//# sourceMappingURL=watch.js.map