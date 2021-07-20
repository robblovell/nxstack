"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setAnnotation = exports.setLabel = void 0;
const setLabel = (resource, key, value, override = true) => {
    var _a;
    if (!override && ((_a = resource.metadata) === null || _a === void 0 ? void 0 : _a.labels[key]))
        return resource;
    resource.metadata = resource.metadata || {};
    resource.metadata.labels = Object.assign(Object.assign({}, resource.metadata.labels), { [key]: value });
    return resource;
};
exports.setLabel = setLabel;
const setAnnotation = (resource, key, value, override = true) => {
    var _a;
    if (!override && ((_a = resource.metadata) === null || _a === void 0 ? void 0 : _a.annotations[key]))
        return resource;
    resource.metadata = resource.metadata || {};
    resource.metadata.annotations = Object.assign(Object.assign({}, resource.metadata.annotations), { [key]: value });
    return resource;
};
exports.setAnnotation = setAnnotation;
//# sourceMappingURL=markers.js.map