"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthLoginPerformer = void 0;
const tslib_1 = require("tslib");
const open_1 = tslib_1.__importDefault(require("open"));
const httpServer_1 = require("../httpServer");
const base_1 = require("./base");
const hubURL = process.env.HUB_LOGIN_URL || process.env.HUB_SERVER_URL || 'http://localhost:1234';
class AuthLoginPerformer extends base_1.AuthPerformer {
    constructor() {
        super(...arguments);
        this.whenYes = (params) => {
            if (params.token)
                return false;
            return this.hasValidToken() && !params.yes;
        };
        this.loginServerCallback = (req, res) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            try {
                const url = req;
                const token = req.url.slice('/?access_token='.length, url.length);
                if (token === null || token === void 0 ? void 0 : token.length) {
                    yield this.setToken(token);
                    (_a = this.status) === null || _a === void 0 ? void 0 : _a.info('You are logged in. You may close the browser window now. Thank you.');
                    res.end('You may close this window now. Thank you.');
                }
                else {
                    (_b = this.status) === null || _b === void 0 ? void 0 : _b.info('Something went wrong. Unable to retrieve token.');
                    res.end('Something went wrong. Unable to retrieve token.');
                }
            }
            catch (ex) {
                (_c = this.status) === null || _c === void 0 ? void 0 : _c.error(ex, 'HTTP Server failed to do whatever');
            }
            finally {
                this.server.stop();
            }
        });
    }
    perform() {
        const _super = Object.create(null, {
            prompt: { get: () => super.prompt }
        });
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const responses = yield _super.prompt.call(this, {
                name: 'yes',
                message: 'You are already logged in. Log out current user?',
                type: 'confirm',
                default: false,
                when: this.whenYes,
            }, this.params);
            if (!responses.yes)
                return;
            if (responses.dryRun)
                return;
            if (this.params.token) {
                yield this.setToken(this.params.token);
                return;
            }
            yield this.login();
        });
    }
    login() {
        var _a;
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            this.server = new httpServer_1.HTTPServer();
            this.server.start(2222, this.loginServerCallback);
            if (process.env.NODE_ENV === 'development')
                yield open_1.default(`${hubURL}?login=cli`);
            else
                yield open_1.default('https://codezero.io?login=cli');
            (_a = this.status) === null || _a === void 0 ? void 0 : _a.info('Waiting for credentials. Please continue in your web browser. Use the --token option if you are on a headless machine.');
            return this.server.serverPromise;
        });
    }
}
exports.AuthLoginPerformer = AuthLoginPerformer;
//# sourceMappingURL=login.js.map