"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionOrchestrator = void 0;
const tslib_1 = require("tslib");
const base_1 = require("./base");
const logger_1 = require("@c6o/logger");
const factory_1 = require("./factory");
const session_1 = require("../services/session");
const kubernetes_1 = require("./kubernetes");
const file_1 = require("../services/session/storage/file");
const cluster_1 = require("../services/session/storage/cluster");
const debug = logger_1.createDebug();
class SessionOrchestrator extends base_1.Orchestrator {
    apply() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            throw new Error('Session orchestrator does not do apply');
        });
    }
    listSessions() {
        var _a, _b;
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield kubernetes_1.Kubernetes.ensureCluster(this.params);
            const sessions = yield file_1.FileSessionStorage.list();
            debug('Sessions %o', sessions);
            if (sessions.length) {
                this.UI.list(sessions, 'display', 'The following local sessions are active:');
                this.UI.reporter.newline();
            }
            else
                (_a = this.params.status) === null || _a === void 0 ? void 0 : _a.warn('No active local sessions');
            const clusterSessions = yield cluster_1.ClusterSessionStorage.list(this.params);
            if (clusterSessions.length) {
                const metadata = clusterSessions.map(session => session.metadata.name);
                this.UI.listStrings(metadata, 'The following cluster sessions are active:');
            }
            else
                (_b = this.params.status) === null || _b === void 0 ? void 0 : _b.warn('No active cluster sessions');
            if (this.params.detail) {
                const detailSessions = yield session_1.Session.subSessionList(this.params);
                this.UI.reporter.newline();
                const displayValues = detailSessions.map(details => details.substring(0, details.length - '.json'.length));
                this.UI.listStrings(displayValues, 'The following sub-sessions files remain:', 'warn');
            }
        });
    }
    closeSession() {
        var _a;
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield kubernetes_1.Kubernetes.ensureCluster(this.params);
            if (this.params.purge)
                return yield this.purge();
            const sessions = yield file_1.FileSessionStorage.list();
            debug('Sessions %o', sessions);
            if (this.params.all) {
                for (const session of sessions) {
                    yield this.close(session);
                    this.UI.reporter.newline();
                }
                if (sessions.length)
                    return;
            }
            else {
                const result = yield this.UI.selectOne(sessions, 'Select a session to close', 'session', 'display');
                if (result.session)
                    return yield this.close(result.session);
            }
            (_a = this.params.status) === null || _a === void 0 ? void 0 : _a.warn('No active sessions found');
        });
    }
    close(session) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            this.UI.reporter.print(`Closing session ${session.display}`, 'highlight');
            this.UI.reporter.newline();
            const orchestrator = this.orchestratorFromSession(session);
            yield orchestrator.apply();
        });
    }
    purge() {
        var _a, _b, _c;
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const result = yield this.UI.confirm('Are you sure you want to purge sessions? You will have to manually clean-up session residue', false);
            if (!result)
                return;
            this.UI.reporter.newline();
            (_a = this.params.status) === null || _a === void 0 ? void 0 : _a.push('Purging all session data');
            try {
                yield session_1.Session.purge(this.params);
            }
            catch (err) {
                (_b = this.params.status) === null || _b === void 0 ? void 0 : _b.error(err);
            }
            finally {
                (_c = this.params.status) === null || _c === void 0 ? void 0 : _c.pop();
            }
        });
    }
    orchestratorFromSession(description) {
        const orchestrationFactory = factory_1.Factory[description.handler];
        if (orchestrationFactory === undefined || orchestrationFactory === null)
            throw new Error(`Factory does not contain '${description.handler}'`);
        const params = description.cleanUpParams;
        params.status = this.params.status;
        return orchestrationFactory(params);
    }
}
exports.SessionOrchestrator = SessionOrchestrator;
//# sourceMappingURL=session.js.map