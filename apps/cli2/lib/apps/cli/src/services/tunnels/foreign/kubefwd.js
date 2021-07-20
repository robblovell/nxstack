"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KubefwdTuneller = void 0;
const tslib_1 = require("tslib");
const logger_1 = require("@c6o/logger");
const session_1 = require("../../session");
const kubefwd_1 = require("@c6o/kubefwd");
const contracts_1 = require("@provisioner/contracts");
const process_1 = require("process");
const axios_1 = tslib_1.__importDefault(require("axios"));
const common_1 = require("@c6o/common");
const debug = logger_1.createDebug();
class KubefwdTuneller extends session_1.ExternalService {
    get signature() { return 'foreign-tunnel'; }
    isKubeFwdRunning() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const namespace = yield this.session.get('namespace');
            if (namespace && namespace != this.params.namespace)
                throw new Error(`Cannot start a new foreign tunnel session in ${namespace} as one is already running in ${this.params.namespace}`);
            return !!namespace;
        });
    }
    sessionInProgress() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield this.isKubeFwdRunning();
            return false;
        });
    }
    cleanUpMessage(hasDependant) {
        return hasDependant ?
            `Leaving tunnel to ${this.params.namespace} untouched` :
            `Cleaning tunnel to ${this.params.namespace}`;
    }
    execute() {
        const _super = Object.create(null, {
            wrapStatus: { get: () => super.wrapStatus }
        });
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const running = yield this.isKubeFwdRunning();
            const message = running ?
                `Tunnel into ${this.params.namespace} is already up` :
                `Starting tunnel into ${this.params.namespace}`;
            yield _super.wrapStatus.call(this, message, () => tslib_1.__awaiter(this, void 0, void 0, function* () {
                if (!running) {
                    const cmd = yield kubefwd_1.getKubefwdCmd();
                    const result = yield this.params.cluster.list(contracts_1.NamespaceHelper.template());
                    result.throwIfError();
                    const restNamespaces = Array.from(result.each('Namespace')).filter(n => n.metadata.name !== this.params.namespace);
                    const restParams = restNamespaces.map(n => ['-n', n.metadata.name]);
                    yield this.spawner(cmd, false, 'svc', '-n', this.params.namespace, ...[].concat.apply([], restParams));
                    debug(`Checking for kubefwd sync on port ${process_1.env.KUBEFWD_SYNCED_PORT || 9003}`);
                    yield common_1.attempt(100, 200, () => tslib_1.__awaiter(this, void 0, void 0, function* () { return !!(yield this.waitForKubeFwd()); }));
                    yield this.session.set('namespace', this.params.namespace);
                }
            }));
        });
    }
    waitForKubeFwd() {
        var _a;
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const port = process_1.env.KUBEFWD_SYNCED_PORT || 9003;
            const result = yield axios_1.default.get(`http://localhost:${port}/status`);
            return result.status === 200 && ((_a = result.data) === null || _a === void 0 ? void 0 : _a.ready);
        });
    }
}
exports.KubefwdTuneller = KubefwdTuneller;
//# sourceMappingURL=kubefwd.js.map