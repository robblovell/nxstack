"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.optionsMixin = void 0;
const optionsMixin = (base) => class extends base {
    providedDeprovisionOption(option, answers) {
        var _a;
        answers = answers || {};
        return (((_a = this.spec.deprovision) === null || _a === void 0 ? void 0 : _a[option]) !== undefined) || (answers[option] !== undefined);
    }
    getDeprovisionOption(option, defaultValue, answers) {
        var _a;
        answers = answers || {};
        if (((_a = this.spec.deprovision) === null || _a === void 0 ? void 0 : _a[option]) !== undefined)
            return this.spec.deprovision[option];
        return answers[option] !== undefined ? answers[option] : defaultValue;
    }
    setDeprovisionOption(option, value) {
        this.spec.deprovision = this.spec.deprovision || {};
        this.spec.deprovision[option] = value;
    }
};
exports.optionsMixin = optionsMixin;
//# sourceMappingURL=options.js.map