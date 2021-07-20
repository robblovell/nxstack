"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Service = exports.projectBaseDir = void 0;
const tslib_1 = require("tslib");
const events_1 = require("events");
const pkg_dir_1 = tslib_1.__importDefault(require("pkg-dir"));
exports.projectBaseDir = pkg_dir_1.default.sync(__dirname);
class Service extends events_1.EventEmitter {
    constructor(params) {
        super();
        this.params = params;
        this.status = params.status;
    }
    wrapStatus(message, promiseOrFb) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const status = message ?
                this.params.status :
                undefined;
            status === null || status === void 0 ? void 0 : status.push(message);
            try {
                return typeof promiseOrFb === 'function' ?
                    yield promiseOrFb() :
                    yield promiseOrFb;
            }
            catch (e) {
                status === null || status === void 0 ? void 0 : status.error(e);
                throw e;
            }
            finally {
                status === null || status === void 0 ? void 0 : status.pop();
            }
        });
    }
}
exports.Service = Service;
//# sourceMappingURL=base.js.map