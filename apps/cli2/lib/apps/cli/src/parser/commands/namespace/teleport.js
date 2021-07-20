"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NamespaceTeleport = void 0;
const baseTeleport_1 = require("../baseTeleport");
class NamespaceTeleport extends baseTeleport_1.BaseTeleportCommand {
    constructor() {
        super(...arguments);
        this.workloadKind = 'Namespace';
    }
}
exports.NamespaceTeleport = NamespaceTeleport;
NamespaceTeleport.description = 'Teleport your local machine so feels like you are in a Namespace';
NamespaceTeleport.examples = [
    'czctl namespace teleport halyard',
];
NamespaceTeleport.flags = baseTeleport_1.BaseTeleportCommand.flags;
NamespaceTeleport.args = baseTeleport_1.BaseTeleportCommand.args;
//# sourceMappingURL=teleport.js.map