"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NgrokProcess = void 0;
const tslib_1 = require("tslib");
const path_1 = tslib_1.__importDefault(require("path"));
const detect_port_1 = tslib_1.__importDefault(require("detect-port"));
const base_1 = require("../../base");
const session_1 = require("../../session");
const client_1 = require("./client");
const common_1 = require("@c6o/common");
const pathToChild = path_1.default.resolve(base_1.projectBaseDir, 'node_modules/ngrok/bin/ngrok');
class NgrokProcess extends session_1.ExternalService {
    get signature() { return 'local-tunnel-ngrok '; }
    sessionInProgress() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return false;
        });
    }
    cleanUpMessage(hasDependant) {
        return hasDependant ?
            'Leaving local tunnel worker process untouched' :
            'Closing local tunnel worker process';
    }
    performBackground() {
        const _super = Object.create(null, {
            spawner: { get: () => super.spawner }
        });
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const ngrokPID = yield this.session.get('child-pid');
            if (ngrokPID)
                return;
            if ((yield detect_port_1.default(4040)) !== 4040)
                throw new Error('Unable to start tunnel as port 4040 is occupied');
            const msg = 'Starting tunnel worker process';
            yield this.wrapStatus(msg, _super.spawner.call(this, pathToChild, false, 'start', '--none', '--log=stdout'));
            yield common_1.attempt(25, 400, () => tslib_1.__awaiter(this, void 0, void 0, function* () { return !!(yield client_1.getClient()); }));
        });
    }
}
exports.NgrokProcess = NgrokProcess;
//# sourceMappingURL=process.js.map