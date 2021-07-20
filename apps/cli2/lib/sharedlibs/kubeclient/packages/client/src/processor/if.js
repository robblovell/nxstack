"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ifMixin = void 0;
const tslib_1 = require("tslib");
const kubeclient_contracts_1 = require("@c6o/kubeclient-contracts");
const ifMixin = (base) => class ifMixinImp extends base {
    if(condition, trueCallback, falseCallback) {
        const ifFn = () => tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (yield condition)
                yield trueCallback(this);
            else if (falseCallback)
                yield falseCallback(this);
            return new kubeclient_contracts_1.Result(condition);
        });
        return this.do(ifFn);
    }
};
exports.ifMixin = ifMixin;
//# sourceMappingURL=if.js.map