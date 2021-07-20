"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resourceMixin = void 0;
const tslib_1 = require("tslib");
const debug_1 = tslib_1.__importDefault(require("debug"));
const debug = debug_1.default('@kubeclient:cluster:toAddress');
const resourceMixin = (base) => class extends base {
    constructor() {
        super(...arguments);
        this.resourceCache = new Map();
    }
    toAddress(document) {
        var _a, _b, _c, _d, _e, _f, _g;
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                const api = document.apiVersion && document.apiVersion != 'v1' ?
                    `/apis/${document.apiVersion}` :
                    '/api/v1';
                if (!document.kind)
                    throw new Error('No document kind given for document in resources.ts-> resourceMixin::toAddress');
                let resourceInfo = this.resourceCache.get((_a = document.kind) === null || _a === void 0 ? void 0 : _a.toLowerCase());
                if (!resourceInfo) {
                    const result = yield this.request.get(api);
                    if (result.resources)
                        result.resources.forEach(resource => {
                            if (resource.name.indexOf('/') == -1)
                                this.resourceCache.set(resource.kind.toLowerCase(), resource);
                        });
                    resourceInfo = this.resourceCache.get(document.kind.toLowerCase());
                    if (!resourceInfo)
                        throw new Error('Resource info is not defined in resources.ts-> resourceMixin::toAddress');
                }
                const endpoint = resourceInfo.namespaced && ((_b = document.metadata) === null || _b === void 0 ? void 0 : _b.namespace) ?
                    `${api}/namespaces/${document.metadata.namespace}/${resourceInfo.name}` :
                    `${api}/${resourceInfo.name}`;
                const url = ((_c = document.metadata) === null || _c === void 0 ? void 0 : _c.name) ?
                    endpoint + `/${document.metadata.name}` :
                    endpoint;
                const baseWatchURL = resourceInfo.namespaced && ((_d = document.metadata) === null || _d === void 0 ? void 0 : _d.namespace) ?
                    `${api}/watch/namespaces/${(_e = document.metadata) === null || _e === void 0 ? void 0 : _e.namespace}/${resourceInfo.name}` :
                    `${api}/watch/${resourceInfo.name}`;
                const watchEndpoint = ((_f = document.metadata) === null || _f === void 0 ? void 0 : _f.name) ?
                    `${baseWatchURL}/${(_g = document.metadata) === null || _g === void 0 ? void 0 : _g.name}` :
                    baseWatchURL;
                return { api, url, endpoint, watchEndpoint };
            }
            catch (ex) {
                debug('Failed to fetch resource address %o %o', document, ex);
                throw ex;
            }
        });
    }
    toString(document) {
        var _a, _b, _c;
        return ((_a = document.metadata) === null || _a === void 0 ? void 0 : _a.namespace) ?
            `${document.kind} ${((_b = document.metadata) === null || _b === void 0 ? void 0 : _b.name) || ''} in namespace ${document.metadata.namespace}` :
            `${document.kind} ${((_c = document.metadata) === null || _c === void 0 ? void 0 : _c.name) || ''}`;
    }
};
exports.resourceMixin = resourceMixin;
//# sourceMappingURL=resources.js.map