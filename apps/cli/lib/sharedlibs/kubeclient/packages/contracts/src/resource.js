"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toResourceId = exports.ResourceAddress = void 0;
class ResourceAddress {
}
exports.ResourceAddress = ResourceAddress;
const toResourceId = (resource) => {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    return ({
        apiVersion: resource.apiVersion,
        kind: resource.kind,
        metadata: Object.assign(Object.assign(Object.assign(Object.assign({}, (((_a = resource.metadata) === null || _a === void 0 ? void 0 : _a.namespace) ? { namespace: (_b = resource.metadata) === null || _b === void 0 ? void 0 : _b.namespace } : undefined)), (((_c = resource.metadata) === null || _c === void 0 ? void 0 : _c.name) ? { name: (_d = resource.metadata) === null || _d === void 0 ? void 0 : _d.name } : undefined)), (((_e = resource.metadata) === null || _e === void 0 ? void 0 : _e.labels) ? { labels: (_f = resource.metadata) === null || _f === void 0 ? void 0 : _f.labels } : undefined)), (((_g = resource.metadata) === null || _g === void 0 ? void 0 : _g.annotations) ? { annotations: (_h = resource.metadata) === null || _h === void 0 ? void 0 : _h.annotations } : undefined))
    });
};
exports.toResourceId = toResourceId;
//# sourceMappingURL=resource.js.map