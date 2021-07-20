"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.attemptMixin = void 0;
const tslib_1 = require("tslib");
const attemptMixin = (base) => class attemptMixinImp extends base {
    attempt(times, sleepTime, callback) {
        const attemptFn = () => tslib_1.__awaiter(this, void 0, void 0, function* () {
            let attempts = 0;
            times = times - 1;
            do {
                if (attempts) {
                    yield this.sleep(sleepTime);
                }
                try {
                    let result = yield callback(this, attempts);
                    if (result)
                        return result;
                }
                catch (_a) {
                }
                if (++attempts > times)
                    throw new Error(`Failed to get a result after ${attempts} attempts...`);
            } while (true);
        });
        return this.do(attemptFn);
    }
};
exports.attemptMixin = attemptMixin;
//# sourceMappingURL=attempt.js.map