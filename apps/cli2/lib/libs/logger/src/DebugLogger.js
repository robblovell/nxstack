"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DebugLogger = void 0;
const tslib_1 = require("tslib");
const inversify_1 = require("inversify");
const debug_1 = tslib_1.__importDefault(require("debug"));
let DebugLogger = class DebugLogger {
    constructor() {
        this.debug = (...args) => this._debug(...args);
        this.info = (...args) => this._debug(...args);
        this.warn = (...args) => this._debug(...args);
        this.error = (...args) => this._debug(...args);
    }
    init(path) {
        this._debug = debug_1.default(path);
    }
};
DebugLogger = tslib_1.__decorate([
    inversify_1.injectable()
], DebugLogger);
exports.DebugLogger = DebugLogger;
//# sourceMappingURL=DebugLogger.js.map