"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serve = void 0;
const tslib_1 = require("tslib");
const path_1 = tslib_1.__importDefault(require("path"));
function serve(req, res) {
    res.sendFile(req.url, { root: path_1.default.resolve(__dirname, '../lib/ui') });
}
exports.serve = serve;
//# sourceMappingURL=serve.js.map