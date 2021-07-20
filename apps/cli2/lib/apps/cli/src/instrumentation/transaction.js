"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.endMetricsTransaction = exports.startMetricsTransaction = void 0;
const tslib_1 = require("tslib");
const Sentry = tslib_1.__importStar(require("@sentry/node"));
const startMetricsTransaction = (name) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    if (process.env.CZ_ENV === 'development')
        return;
    return yield Sentry.startTransaction({ name });
});
exports.startMetricsTransaction = startMetricsTransaction;
const endMetricsTransaction = (transaction) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    if (process.env.CZ_ENV === 'development')
        return;
    yield (transaction === null || transaction === void 0 ? void 0 : transaction.finish());
});
exports.endMetricsTransaction = endMetricsTransaction;
//# sourceMappingURL=transaction.js.map