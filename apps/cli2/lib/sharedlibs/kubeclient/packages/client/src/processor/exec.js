"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.execMixin = void 0;
const execMixin = (base) => class execMixinImp extends base {
    exec(document, command, stdout, stderr, stdin) {
        this.do(() => this.cluster.exec(document, command, stdout, stderr, stdin));
        return this;
    }
};
exports.execMixin = execMixin;
//# sourceMappingURL=exec.js.map