"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SilentLogger = void 0;
const tslib_1 = require("tslib");
const inversify_1 = require("inversify");
let SilentLogger = class SilentLogger {
    debug() { }
    info() { }
    warn() { }
    error() { }
};
SilentLogger = tslib_1.__decorate([
    inversify_1.injectable()
], SilentLogger);
exports.SilentLogger = SilentLogger;
//# sourceMappingURL=SilentLogger.js.map