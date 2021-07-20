"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.patchMixin = void 0;
const tslib_1 = require("tslib");
const patchMixin = (base) => class extends base {
    constructor() {
        super();
    }
    patchImplementation(request) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const resource = yield this.getResource(request.kind, request.name, request.namespace, request.apiVersion);
            const result = yield this.cluster.patch(resource, [
                {
                    'op': request.op,
                    'path': request.path,
                    'value': JSON.parse(request.value)
                }
            ]);
            result.throwIfError();
            return;
        });
    }
};
exports.patchMixin = patchMixin;
//# sourceMappingURL=patch.js.map