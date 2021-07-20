"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResourceHelper = void 0;
const markers_1 = require("./markers");
class ResourceHelper {
    constructor(resource = {}) {
        this.resource = resource;
        this.resource.apiVersion = this.resource.apiVersion || 'v1';
        this.resource.metadata = this.resource.metadata || {};
    }
    get isNew() { return !!this.resource.metadata.uid; }
    get name() { return this.resource.metadata.name; }
    get namespace() { return this.resource.metadata.namespace; }
    get spec() { return this.resource.spec; }
    get metadata() { return this.resource.metadata; }
    get ownerReferences() { return this.resource.metadata.ownerReferences; }
    setLabel(key, value, override = true) {
        markers_1.setLabel(this.resource, key, value, override);
        return this;
    }
    setAnnotation(key, value, override = true) {
        markers_1.setAnnotation(this.resource, key, value, override);
        return this;
    }
    toString() {
        var _a, _b, _c;
        return ((_a = this.resource.metadata) === null || _a === void 0 ? void 0 : _a.namespace) ?
            `${this.resource.kind} ${((_b = this.resource.metadata) === null || _b === void 0 ? void 0 : _b.name) || ''} in namespace ${this.resource.metadata.namespace}` :
            `${this.resource.kind} ${((_c = this.resource.metadata) === null || _c === void 0 ? void 0 : _c.name) || ''}`;
    }
    *each(kind) {
        if (!this.resource.items)
            return;
        for (const item of this.resource.items)
            yield Object.assign({ apiVersion: this.resource.apiVersion, kind }, item);
    }
}
exports.ResourceHelper = ResourceHelper;
ResourceHelper.isResource = (object) => (typeof object === 'object' && 'kind' in object);
//# sourceMappingURL=resourceHelper.js.map