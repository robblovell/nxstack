"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const os = tslib_1.__importStar(require("os"));
const Sentry = tslib_1.__importStar(require("@sentry/node"));
const object_hash_1 = tslib_1.__importDefault(require("object-hash"));
if (process.env.CZ_ENV !== 'development') {
    Sentry.init({
        dsn: 'https://51013c81a32a424da4794ac3303f77b1@o820541.ingest.sentry.io/5809151',
        tracesSampleRate: process.env.SENTRY_RATE ? parseInt(process.env.SENTRY_RATE) : 1.0,
        enabled: !process.env.NO_SENTRY,
        environment: process.env.CZ_ENV || 'production'
    });
    Sentry.setUser({
        id: object_hash_1.default(`${process.env.USER}-${process.env.HOST}`),
        host: os.hostname(),
        username: os.userInfo().username
    });
}
//# sourceMappingURL=instrumentation.js.map