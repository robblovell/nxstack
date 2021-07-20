"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseClient = void 0;
const tslib_1 = require("tslib");
const axios_1 = tslib_1.__importDefault(require("axios"));
const jose = tslib_1.__importStar(require("node-jose"));
const inversify_1 = require("inversify");
let BaseClient = class BaseClient {
    constructor() {
        this.isPEM = () => this.privateKey.startsWith('-----BEGIN RSA PRIVATE KEY-----');
        this.data = (data) => this.privateKey ? undefined : data;
        this.toData = (res) => { var _a; return ((_a = res.data) === null || _a === void 0 ? void 0 : _a.data) || res.data; };
        this.toFirst = (res) => {
            const data = this.toData(res);
            if (data === null || data === void 0 ? void 0 : data.length)
                return data[0];
        };
    }
    parseURL(service) {
        if (service.startsWith(this.apiURL) || service.startsWith('http'))
            return service;
        if (service.startsWith('/') && this.apiURL.endsWith('/'))
            return `${this.apiURL.substr(0, this.apiURL.length)}${service.substr(1)}`;
        else if (!service.startsWith('/') && !this.apiURL.endsWith('/'))
            return `${this.apiURL}/${service}`;
        else
            return `${this.apiURL}${service}`;
    }
    init(token, privateKey, jwkId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (!this.token)
                this.token = token || (yield this.tokenPromise);
            if (!this.privateKey) {
                this.privateKey = privateKey || (yield this.privateKeyPromise);
                if (this.privateKey && typeof this.privateKey === 'string') {
                    const keyPem = this.isPEM() ?
                        this.privateKey :
                        Buffer.from(this.privateKey, 'base64').toString();
                    this.privateKey = yield jose.JWK.asKey(keyPem, 'pem');
                }
                this.jwkId = jwkId;
            }
        });
    }
    headers(service, data, headers) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (this.token)
                return Object.assign({ 'Authorization': `Bearer ${this.token}` }, headers);
            if (this.privateKey) {
                const payload = {
                    path: service,
                    data
                };
                const header = yield jose.JWS
                    .createSign({ format: 'compact' }, this.privateKey)
                    .update(JSON.stringify(payload))
                    .final();
                return Object.assign({ jws: header, jwkId: this.jwkId }, headers);
            }
        });
    }
    get(service, params) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield this.init();
            const path = this.parseURL(service);
            const result = yield axios_1.default.get(path, { params, headers: yield this.headers(service) });
            return result;
        });
    }
    post(service, data, options) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield this.init();
            const path = this.parseURL(service);
            const result = yield axios_1.default.post(path, this.data(data), options || { headers: yield this.headers(service, data) });
            return result;
        });
    }
    put(service, data, options) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield this.init();
            const path = this.parseURL(service);
            const result = yield axios_1.default.put(path, this.data(data), options || { headers: yield this.headers(service, data) });
            return result;
        });
    }
    patch(service, data) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield this.init();
            const path = this.parseURL(service);
            return yield axios_1.default.patch(path, this.data(data), { headers: yield this.headers(service, data) });
        });
    }
    delete(service) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const path = this.parseURL(service);
            return yield axios_1.default.delete(path, { headers: yield this.headers(service) });
        });
    }
};
BaseClient = tslib_1.__decorate([
    inversify_1.injectable()
], BaseClient);
exports.BaseClient = BaseClient;
//# sourceMappingURL=BaseClient.js.map