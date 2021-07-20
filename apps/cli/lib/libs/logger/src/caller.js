"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.caller = void 0;
const tslib_1 = require("tslib");
const path_1 = tslib_1.__importDefault(require("path"));
const callsite_1 = tslib_1.__importDefault(require("callsite"));
function caller(depth = 0, defaults = {
    packagesMatch: 'packages',
    libMatch: '/lib'
}) {
    const stack = callsite_1.default()[depth + 2];
    const requester = stack.getFileName();
    if (!requester) {
        return {
            module: 'Anonymous',
            path: 'unknown',
            filename: 'unknown',
            line: -1
        };
    }
    let dir = path_1.default.dirname(requester);
    const index = dir.indexOf(defaults.packagesMatch);
    if (~index) {
        dir = dir.substring(index + defaults.packagesMatch.length, dir.length);
    }
    let filename = requester;
    const fileIndex = requester.lastIndexOf(defaults.libMatch);
    if (~fileIndex) {
        filename = requester.substring(fileIndex + defaults.libMatch.length, requester.length);
    }
    dir = dir
        .replace(defaults.libMatch, '')
        .replace(/[//+]/g, ':');
    return {
        module: dir,
        path: requester,
        filename,
        line: stack.getLineNumber()
    };
}
exports.caller = caller;
//# sourceMappingURL=caller.js.map