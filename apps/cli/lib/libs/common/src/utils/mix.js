"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mix = void 0;
const mix = (superclass = class {
}) => new MixinBuilder(superclass);
exports.mix = mix;
class MixinBuilder {
    constructor(superclass) {
        this.superclass = superclass;
        this.superclass = superclass;
    }
    with(...mixins) {
        return mixins.reduce((c, mixin) => mixin(c), this.superclass);
    }
}
//# sourceMappingURL=mix.js.map