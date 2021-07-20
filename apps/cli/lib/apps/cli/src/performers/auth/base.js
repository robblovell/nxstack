"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthPerformer = void 0;
const tslib_1 = require("tslib");
const fs_1 = require("fs");
const os_1 = tslib_1.__importDefault(require("os"));
const debug_1 = tslib_1.__importDefault(require("debug"));
const base_1 = require("../base");
const debug = debug_1.default('@nxstack2cli:utils');
const SERVICE = 'codezero-cli';
const USERNAME = 'token';
const TOKEN_FILE = '.czctlrc';
class AuthPerformer extends base_1.Performer {
    get filepath() { return os_1.default.homedir() + '/' + TOKEN_FILE; }
    getConfig() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                const content = yield fs_1.promises.readFile(this.filepath);
                return JSON.parse(content.toString());
            }
            catch (e) {
                debug('ERROR', e);
                return {};
            }
        });
    }
    saveConfig(config) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            debug('writing to file', this.filepath);
            debug(JSON.stringify(config));
            return fs_1.promises.writeFile(this.filepath, JSON.stringify(config));
        });
    }
    setToken(token) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                const keytar = yield Promise.resolve().then(() => tslib_1.__importStar(require('keytar')));
                yield keytar.setPassword(SERVICE, USERNAME, token);
                debug('System keyring set.');
            }
            catch (e) {
                debug('Warning: system keyring is unavailable.  Storing credentials on filesystem.');
                const config = yield this.getConfig();
                config.auth = {
                    token
                };
                yield this.saveConfig(config);
            }
        });
    }
    hasValidToken() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const token = yield this.getToken();
            return token && token !== 'invalid';
        });
    }
    getToken() {
        var _a;
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                const keytar = yield Promise.resolve().then(() => tslib_1.__importStar(require('keytar')));
                debug('Retrieved keytar token');
                return yield keytar.getPassword(SERVICE, USERNAME);
            }
            catch (e) {
                debug('Error getting password with keytar, trying files based token...');
                try {
                    const config = yield this.getConfig();
                    debug('Retrieved token from file');
                    return (_a = config === null || config === void 0 ? void 0 : config.auth) === null || _a === void 0 ? void 0 : _a.token;
                }
                catch (e) {
                    debug('Failed to get file based token, throwing error.');
                    throw new Error('Failed to get token.');
                }
            }
        });
    }
}
exports.AuthPerformer = AuthPerformer;
//# sourceMappingURL=base.js.map