"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompositeService = void 0;
const tslib_1 = require("tslib");
const object_hash_1 = tslib_1.__importDefault(require("object-hash"));
const Sentry = tslib_1.__importStar(require("@sentry/node"));
const base_1 = require("../base");
const logger_1 = require("@c6o/logger");
const session_1 = require("./session");
const duration_1 = require("../../instrumentation/duration");
const debug = logger_1.createDebug();
class CompositeService extends base_1.Service {
    registerForCleanup(subService) {
        this.subServices.push(subService);
    }
    get signatures() {
        const signature = this.subServices
            .map(subService => subService.signature);
        return signature;
    }
    getSession() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const uniqueId = object_hash_1.default([
                this.handlerName,
                ...this.signatures
            ]);
            const session = new session_1.Session(uniqueId);
            yield session.lock();
            return session;
        });
    }
    postProcess() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (this.subServices.length === 0)
                throw new Error('Service did not register any sub-services');
            const session = yield this.getSession();
            if (this.params.clean) {
                yield duration_1.recordMetricsDuration(session, this.params);
                return yield session.dispose();
            }
            const description = yield this.toDescription();
            description.cleanUpParams.clean = true;
            description.handler = this.handlerName;
            description.signatures = this.signatures;
            session.setDescription(description);
            yield duration_1.recordMetricsDuration(session, this.params, this.handlerName);
            session.release();
        });
    }
    perform(handlerName) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            this.subServices = [];
            this.handlerName = handlerName;
            try {
                yield this.execute();
            }
            catch (ex) {
                yield this.cleanUp();
                throw ex;
            }
            yield this.postProcess();
            if (this.params.wait)
                yield this.wait();
        });
    }
    cleanUp(disposeSession = false) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                for (const service of this.subServices)
                    yield service.cleanUp(true);
            }
            finally {
                const session = yield this.getSession();
                if (disposeSession) {
                    yield session.dispose();
                }
                else {
                    yield session.release();
                }
            }
        });
    }
    wait() {
        var _a;
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            (_a = this.status) === null || _a === void 0 ? void 0 : _a.warn('Waiting for CTRL-C to exit');
            debug('Waiting for CTRL-C %o');
            process.stdin.resume();
            process.on('SIGINT', () => tslib_1.__awaiter(this, void 0, void 0, function* () {
                debug('Processing SIGINT');
                let exitCode = 0;
                try {
                    yield this.cleanUp(true);
                }
                catch (err) {
                    debug('ERROR %o', err);
                    Sentry.captureException(err);
                    exitCode = 1;
                }
                finally {
                    process.exit(exitCode);
                }
            }));
            return new Promise(resolve => setInterval(resolve, 99999999));
        });
    }
}
exports.CompositeService = CompositeService;
//# sourceMappingURL=composite.js.map