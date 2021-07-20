"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logsMixin = void 0;
const tslib_1 = require("tslib");
const kubeclient_contracts_1 = require("@c6o/kubeclient-contracts");
const logsMixin = (base) => class extends base {
    logs(document, follow = false) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const address = yield this.toAddress(document);
            return yield kubeclient_contracts_1.Result.from(this.request.get(address.url + '/log'));
        });
    }
};
exports.logsMixin = logsMixin;
//# sourceMappingURL=logs.js.map