"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createInquireMixin = void 0;
const tslib_1 = require("tslib");
const inquirer_1 = tslib_1.__importDefault(require("inquirer"));
const createInquireMixin = (base) => class extends base {
    createInquire(args) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const answers = {
                httpsRedirect: args['https-redirect'] || this.spec.httpsRedirect
            };
            const response = yield inquirer_1.default.prompt({
                type: 'confirm',
                name: 'httpsRedirect',
                default: true,
                message: 'Enable https redirect?',
            }, answers);
            this.spec.httpsRedirect = response.httpsRedirect;
        });
    }
};
exports.createInquireMixin = createInquireMixin;
//# sourceMappingURL=createInquire.js.map