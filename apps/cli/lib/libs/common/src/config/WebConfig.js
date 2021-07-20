"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebConfig = void 0;
const tslib_1 = require("tslib");
const inversify_1 = require("inversify");
const debug_1 = tslib_1.__importDefault(require("debug"));
const debug = debug_1.default('common:config:web');
let WebConfig = class WebConfig {
    constructor() {
        this.has = (key) => { var _a; return ((_a = this.envVars) === null || _a === void 0 ? void 0 : _a[key]) != undefined; };
        this.util = null;
    }
    get hubLoginURL() {
        return this.get('HUB_LOGIN_URL') || this.hubURL;
    }
    get hubURL() {
        return this.get('HUB_SERVER_URL') || this.apiURL;
    }
    get apiURL() {
        if (this._apiURL)
            return this._apiURL;
        if (window.location.hostname === 'localhost') {
            const port = window.location.port === '1234' || window.location.port === '1238' ?
                '80' : Number.parseInt(window.location.port) > 1300 ?
                '80' :
                '3050';
            return this._apiURL = `http://hub-server:${port}`;
        }
        return this._apiURL = '';
    }
    get envVars() {
        let win = window;
        while (win) {
            if (win.c6oEnv) {
                return win.c6oEnv;
            }
            if (win === win.parent) {
                return undefined;
            }
            win = win.parent;
        }
    }
    init(config) {
        if (!config)
            return;
        if (!window)
            throw Error('"window" not defined. WebConfig has to be used in a browser');
        if (window !== window.parent)
            throw Error('Attempt to initialize WebConfig in non-top level window');
        window.c6oEnv = Object.assign(Object.assign({}, window.c6oEnv), config);
    }
    get(key) {
        var _a;
        try {
            return (_a = this.envVars) === null || _a === void 0 ? void 0 : _a[key];
        }
        catch (ex) {
            debug(`ERROR ${ex}`);
        }
    }
};
WebConfig = tslib_1.__decorate([
    inversify_1.injectable()
], WebConfig);
exports.WebConfig = WebConfig;
//# sourceMappingURL=WebConfig.js.map