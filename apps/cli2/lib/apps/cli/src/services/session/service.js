"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionService = void 0;
const tslib_1 = require("tslib");
const base_1 = require("../base");
const session_1 = require("./session");
const logger_1 = require("@c6o/logger");
const debug = logger_1.createDebug();
class SessionService extends base_1.Service {
    ensureSession() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (this.session)
                return;
            this.session = new session_1.Session(this.signature);
            yield this.session.lock();
        });
    }
    cleanUp(endSession = true) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield this.ensureSession();
            endSession = (yield this.executeCleanup()) && endSession;
            if (endSession) {
                yield this.session.dispose();
                delete this.session;
            }
            else {
                yield this.session.release();
            }
        });
    }
    perform() {
        var _a;
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield this.ensureSession();
            if (this.params.clean)
                return yield this.cleanUp(true);
            if (yield this.sessionInProgress())
                throw Error('A session with this same signature is already running.\nTry: clean it up first by adding \'--clean\' parameter to this command or run \'czctl session close\'');
            try {
                yield this.execute();
            }
            catch (e) {
                debug('ERROR %o', e);
                yield this.cleanUp(true);
                throw e;
            }
            finally {
                (_a = this.session) === null || _a === void 0 ? void 0 : _a.release();
                delete this.session;
            }
        });
    }
}
exports.SessionService = SessionService;
//# sourceMappingURL=service.js.map