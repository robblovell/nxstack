"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionHelper = exports.SessionStatuses = void 0;
const tslib_1 = require("tslib");
const contracts_1 = require("@provisioner/contracts");
const jsonpatch = tslib_1.__importStar(require("fast-json-patch"));
const assign_deep_1 = tslib_1.__importDefault(require("assign-deep"));
const base_1 = require("../../base");
const path_1 = tslib_1.__importDefault(require("path"));
exports.SessionStatuses = {
    lock: {
        Pending: 'Locked',
        Completed: 'Active',
        Error: 'Error'
    }
};
class SessionHelper extends contracts_1.CodeZeroHelper {
    constructor() {
        super(...arguments);
        this.removeUnset = (obj) => {
            Object.keys(obj).forEach(k => (obj[k] && typeof obj[k] === 'object') && this.removeUnset(obj[k]) ||
                (obj[k] === '$unset') && delete obj[k]);
            return obj;
        };
        this.getSessionName = (sessionObject) => Object.keys(sessionObject)[0];
    }
    get sessions() {
        if (this._sessions)
            return this._sessions;
        return this._sessions = this.resource.spec.sessions || [];
    }
    get instanceId() {
        return `${this.namespace}-${this.name}`;
    }
    get spec() {
        return this.resource.spec;
    }
    set spec(spec) {
        this.resource.spec = spec;
    }
    get isNew() {
        return !!this.resource.metadata.uid;
    }
    get sessionNames() {
        return this.sessions.map(sessionObject => this.getSessionName(sessionObject));
    }
    get componentLabels() {
        return Object.assign(Object.assign({}, super.componentLabels), { 'system.codezero.io/session': this.name, 'system.codezero.io/id': this.instanceId });
    }
    exists(cluster, errorMessage) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield cluster.read(this.resource);
                result.throwIfError(errorMessage);
                return !!result.as();
            }
            catch (error) {
                return false;
            }
        });
    }
    static ensureCRD(cluster) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield cluster.begin()
                .upsertFile(path_1.default.resolve(base_1.projectBaseDir, 'k8s/session.v1.yaml'))
                .end();
        });
    }
    toPending(resource, action) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const pendingStatus = exports.SessionStatuses[action].Pending;
            if (resource.status === pendingStatus)
                throw new Error(`Cannot modify ${resource.kind} status to ${pendingStatus} because it is currently ${pendingStatus}`);
            resource.status = pendingStatus;
        });
    }
    toComplete(resource, action) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const completeStatus = exports.SessionStatuses[action].Completed;
            return { op: 'replace', path: '/status', value: completeStatus };
        });
    }
    beginTransaction(cluster) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const current = yield cluster.read(this.resource);
            if (current.object) {
                this.preApplyDocument = jsonpatch.deepClone(current.object);
                this.resource = assign_deep_1.default(this.resource, current.object);
            }
            yield this.toPending(this.resource, 'lock');
            contracts_1.clearDocumentSignal(this.resource);
            const result = this.resource.metadata.resourceVersion ?
                yield cluster.put(this.resource, this.resource) :
                yield cluster.create(this.resource);
            result.throwIfError();
            this.resource = result.as();
            return true;
        });
    }
    endTransaction(cluster) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let diffs = [];
            if (this.preApplyDocument) {
                this.removeUnset = this.removeUnset(this.resource.spec);
                diffs = jsonpatch.compare(this.preApplyDocument, this.resource);
            }
            const completeOp = yield this.toComplete(this.resource, 'lock');
            diffs.push(completeOp);
            const result = yield cluster.patch(this.resource, diffs);
            result.throwIfError();
            this.resource = result.as();
        });
    }
    getSessionSpec(sessionName) {
        return this.getSessionObject(sessionName)[sessionName];
    }
    getSessionObject(sessionName) {
        return this.sessions.find(sessionObject => this.getSessionName(sessionObject) === sessionName) || {};
    }
}
exports.SessionHelper = SessionHelper;
SessionHelper.template = (namespace, name, spec) => ({
    apiVersion: 'system.codezero.io/v1',
    kind: 'Session',
    metadata: Object.assign(Object.assign({}, (name ? { name } : undefined)), (namespace ? { namespace } : undefined)),
    spec
});
SessionHelper.from = (namespace, name, spec) => {
    const template = SessionHelper.template(namespace, name, spec);
    return new SessionHelper(template);
};
//# sourceMappingURL=helper.js.map