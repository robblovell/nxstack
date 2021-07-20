"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseTeleportCommand = void 0;
const tslib_1 = require("tslib");
const base_1 = require("../base");
const kubernetes_1 = require("../kubernetes");
const orchestrators_1 = require("../../orchestrators");
const command_1 = require("@oclif/command");
const flags_1 = require("../flags");
class BaseTeleportCommand extends base_1.BaseCommand {
    constructor() {
        super(...arguments);
        this.flagMaps = Object.assign(Object.assign({}, kubernetes_1.KubernetesNamespacedCommand.flagMaps), { file: 'envFile' });
    }
    go() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            this.params.kind = this.workloadKind;
            yield new orchestrators_1.Teleport(this.params).apply();
        });
    }
}
exports.BaseTeleportCommand = BaseTeleportCommand;
BaseTeleportCommand.flags = Object.assign(Object.assign(Object.assign({}, kubernetes_1.KubernetesNamespacedCommand.flags), flags_1.sessionFlags()), { file: command_1.flags.string({ char: 'f', description: 'Write environment variables to a file.' }), output: command_1.flags.string({ char: 'o', description: 'Dump out the environment variables to the shell.' }) });
BaseTeleportCommand.args = [{
        name: 'resourceName',
        description: 'The name of the Kubernetes resource.',
    }];
//# sourceMappingURL=baseTeleport.js.map