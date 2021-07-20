"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClusterSessionService = void 0;
const tslib_1 = require("tslib");
const service_1 = require("./service");
const session_1 = require("./session");
const cluster_1 = require("./storage/cluster");
const os = tslib_1.__importStar(require("os"));
const node_machine_id_1 = require("node-machine-id");
class ClusterSessionService extends service_1.SessionService {
    sessionUserId() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const mid = yield node_machine_id_1.machineId(true);
            return `${os.userInfo().username}-${mid}`;
        });
    }
    ensureSession() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (this.session)
                return;
            this.session = new session_1.Session(this.signature, new cluster_1.ClusterSessionStorage(this.signature, this.params));
            yield this.session.lock();
        });
    }
}
exports.ClusterSessionService = ClusterSessionService;
//# sourceMappingURL=cluster.js.map