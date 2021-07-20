"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeApplyMixin = void 0;
const tslib_1 = require("tslib");
const removeApplyMixin = (base) => class extends base {
    removeApply() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
        });
    }
};
exports.removeApplyMixin = removeApplyMixin;
//# sourceMappingURL=removeApply.js.map