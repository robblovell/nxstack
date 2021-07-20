"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.attempt = void 0;
const tslib_1 = require("tslib");
const attempt = (times, sleepTime, callback, errorMessage) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    let attempts = 0;
    times = times - 1;
    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
    do {
        if (attempts) {
            yield sleep(sleepTime);
        }
        try {
            const result = yield callback();
            if (result)
                return;
        }
        catch (ex) {
        }
        if (++attempts > times)
            throw new Error(errorMessage || `Failed after ${times + 1} attempts`);
    } while (true);
});
exports.attempt = attempt;
//# sourceMappingURL=attempt.js.map