"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StripeClient = void 0;
const tslib_1 = require("tslib");
const BaseClient_1 = require("./BaseClient");
class StripeClient extends BaseClient_1.BaseClient {
    get apiURL() { return 'https://api.stripe.com'; }
    init(token) {
        const _super = Object.create(null, {
            init: { get: () => super.init }
        });
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield _super.init.call(this, token || process.env.HUB_STRIPE_CLIENT_SECRET);
        });
    }
}
exports.StripeClient = StripeClient;
//# sourceMappingURL=StripeClient.js.map