"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.helpMixin = void 0;
const helpMixin = (base) => class extends base {
    help(command, options, messages) {
        options('--storage', 'grafana provision: Storage to reserve for flow');
        options('--adminUsername', 'grafana provision: Administrator username');
        options('--adminPassword', 'grafana provision: Administrator password');
        options('--force', 'grafana deprovision: force deprovision with added dashboards');
        messages.push('  Grafana Provisioner:');
        messages.push('    - The Grafana provisioner installs Grafana with provisioned storage');
        messages.push('\n');
    }
};
exports.helpMixin = helpMixin;
//# sourceMappingURL=help.js.map