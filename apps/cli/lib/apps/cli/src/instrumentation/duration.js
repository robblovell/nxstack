"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.recordMetricsDuration = void 0;
const tslib_1 = require("tslib");
const Sentry = tslib_1.__importStar(require("@sentry/node"));
const logger_1 = require("@c6o/logger");
const debug = logger_1.createDebug('Metrics');
const recordMetricsDuration = (session, params, displayName) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    if (process.env.CZ_ENV === 'development')
        return;
    if (params.clean) {
        const started = yield session.get('timestamp');
        if (started) {
            const sessionDisplayName = yield session.get('displayName');
            const name = displayName || sessionDisplayName || session.signature;
            const duration = new Date() - new Date(started);
            debug('DURATION (Seconds): ', duration / 1000);
            debug('Transaction Name: ', name);
            const transaction = yield Sentry.startTransaction({
                op: 'duration',
                name,
                startTimestamp: new Date(started).toISOString()
            });
            yield transaction.finish(new Date().toISOString());
        }
    }
    else {
        yield session.set('timestamp', new Date().toISOString());
        if (displayName) {
            debug('Transaction Name Given: ', displayName);
            yield session.set('displayName', displayName);
        }
    }
});
exports.recordMetricsDuration = recordMetricsDuration;
//# sourceMappingURL=duration.js.map