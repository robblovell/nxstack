"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.debug = exports.createDebug = void 0;
const tslib_1 = require("tslib");
const caller_1 = require("./caller");
const debug_1 = tslib_1.__importDefault(require("debug"));
function createDebug(aSubModule) {
    try {
        const info = caller_1.caller();
        return aSubModule ?
            debug_1.default(aSubModule + info.module) :
            debug_1.default(info.module);
    }
    catch (_a) {
        return debug_1.default(aSubModule || 'unknown');
    }
}
exports.createDebug = createDebug;
exports.debug = createDebug();
//# sourceMappingURL=createDebug.js.map