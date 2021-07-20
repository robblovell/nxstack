"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NgrokClient = void 0;
const tslib_1 = require("tslib");
const BaseClient_1 = require("./BaseClient");
const attempt_1 = require("../utils/attempt");
class NgrokClient extends BaseClient_1.BaseClient {
    get apiURL() {
        return 'http://localhost:4040/api';
    }
    getTunnels() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const res = yield this.get('tunnels');
            return this.toData(res);
        });
    }
    isReady() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const params = {
                addr: 1025,
                proto: 'http',
                bind_tls: false,
                name: 'isReadyTest'
            };
            try {
                yield attempt_1.attempt(25, 200, () => tslib_1.__awaiter(this, void 0, void 0, function* () { return !!(yield this.createTunnel(params)); }));
                return true;
            }
            catch (ex) {
                return false;
            }
            finally {
                yield this.deleteTunnel(params.name);
            }
        });
    }
    createTunnel(data) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const res = yield this.post('tunnels', data);
            return this.toData(res);
        });
    }
    deleteTunnel(name) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const res = yield this.delete(`tunnels/${name}`);
            return this.toData(res);
        });
    }
}
exports.NgrokClient = NgrokClient;
//# sourceMappingURL=ngrok.js.map