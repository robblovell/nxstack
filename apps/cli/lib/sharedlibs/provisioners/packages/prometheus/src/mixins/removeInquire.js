"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeInquireMixin = void 0;
const tslib_1 = require("tslib");
const inquirer_1 = tslib_1.__importDefault(require("inquirer"));
const removeInquireMixin = (base) => class extends base {
    removeInquire(answers) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (!this.simpleServiceProvided(answers)) {
                const response = yield inquirer_1.default.prompt({
                    type: 'confirm',
                    name: 'simpleService',
                    default: false,
                    message: 'Deprovision simple prometheus service?',
                });
                this.spec.simpleService = (response === null || response === void 0 ? void 0 : response.simpleService) || false;
            }
        });
    }
};
exports.removeInquireMixin = removeInquireMixin;
//# sourceMappingURL=removeInquire.js.map