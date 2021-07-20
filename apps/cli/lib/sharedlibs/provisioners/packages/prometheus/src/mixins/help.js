"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.helpMixin = void 0;
const helpMixin = (base) => class extends base {
    help(command, options, messages) {
        messages.push('  Prometheus Provisioner:');
        messages.push('    - The Prometheus provisioner installs Prometheus to monitor the cluster and other metrics');
        messages.push('\n');
    }
};
exports.helpMixin = helpMixin;
//# sourceMappingURL=help.js.map