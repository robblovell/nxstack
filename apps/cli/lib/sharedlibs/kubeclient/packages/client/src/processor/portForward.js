"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.portForwardMixin = void 0;
const tslib_1 = require("tslib");
const portForwardMixin = (base) => class portForwardMixinImp extends base {
    beginForward(containerPort, document) {
        if (this.portForwardResult)
            throw new Error('You can only create one port forward per cluster at this time');
        this.do(() => tslib_1.__awaiter(this, void 0, void 0, function* () {
            this.portForwardResult = yield this.cluster.portForward(containerPort, document);
            return this.portForwardResult;
        }));
        return this;
    }
    endForward() {
        const endForwardFn = () => tslib_1.__awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            if ((_b = (_a = this.portForwardResult) === null || _a === void 0 ? void 0 : _a.other) === null || _b === void 0 ? void 0 : _b.disposer) {
                this.portForwardResult.other.disposer();
                this.portForwardResult = null;
            }
        });
        this.do(endForwardFn);
        return this;
    }
};
exports.portForwardMixin = portForwardMixin;
//# sourceMappingURL=portForward.js.map