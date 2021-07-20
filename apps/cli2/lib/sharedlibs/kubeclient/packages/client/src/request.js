"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Request = void 0;
const tslib_1 = require("tslib");
const request_promise_native_1 = tslib_1.__importDefault(require("request-promise-native"));
const request_1 = tslib_1.__importDefault(require("request"));
const byline_1 = tslib_1.__importDefault(require("byline"));
class Request {
    constructor(kubeConfig, impersonate = undefined) {
        this.kubeConfig = kubeConfig;
        this.impersonate = impersonate;
    }
    getRequestOptions(path, options = {}) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            options.url = `${this.kubeConfig.getCurrentCluster().server}${path}`;
            options.json = true;
            options.useQuerystring = true;
            yield this.kubeConfig.applyToRequest(options);
            if (options.labelSelector) {
                if (!options.qs)
                    options.qs = {};
                options.qs.labelSelector = Object.keys(options.labelSelector)
                    .map(label => `${label}=${options.labelSelector[label]}`)
                    .join(',');
                delete options.labelSelector;
            }
            const impersonate = this.impersonate || options.impersonate;
            if (impersonate)
                options.headers['Impersonate-User'] = impersonate;
            return options;
        });
    }
    get(path, options = {}) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const localOptions = yield this.getRequestOptions(path, options);
            return yield request_promise_native_1.default.get(localOptions);
        });
    }
    post(path, body, options = {}) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const localOptions = yield this.getRequestOptions(path, Object.assign({ body }, options));
            return yield request_promise_native_1.default.post(localOptions);
        });
    }
    put(path, body) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const localOptions = yield this.getRequestOptions(path, { body });
            return yield request_promise_native_1.default.put(localOptions);
        });
    }
    patch(path, body, _options) {
        var _a;
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const localOptions = yield this.getRequestOptions(path, { body });
            localOptions.headers['content-type'] = ((_a = _options === null || _options === void 0 ? void 0 : _options.headers) === null || _a === void 0 ? void 0 : _a['content-type']) ||
                Array.isArray(body) ?
                'application/json-patch+json' :
                'application/merge-patch+json';
            return yield request_promise_native_1.default.patch(localOptions);
        });
    }
    delete(path) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const localOptions = yield this.getRequestOptions(path);
            return yield request_promise_native_1.default.delete(localOptions);
        });
    }
    watch(watchEndpoint, opts, callback, done) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            opts.method = 'GET';
            const localOptions = yield this.getRequestOptions(watchEndpoint, opts);
            if (localOptions.qs)
                localOptions.qs.watch = true;
            else
                localOptions.qs = { watch: true };
            const stream = byline_1.default.createStream();
            stream.on('data', (line) => {
                try {
                    const data = JSON.parse(line);
                    if (data.type)
                        callback(data.type, data.object);
                    else
                        callback(null, data);
                }
                catch (_a) {
                }
            });
            stream.on('error', (err) => done(err));
            stream.on('close', () => done(null));
            const req = request_1.default(localOptions, (error, response, body) => {
                if (error) {
                    done(error);
                }
                else if (response && response.statusCode !== 200) {
                    done(new Error(response.statusMessage));
                }
                else {
                    done(null);
                }
            });
            req.pipe(stream);
            return req;
        });
    }
}
exports.Request = Request;
//# sourceMappingURL=request.js.map