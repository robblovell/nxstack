"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PodTeleport = void 0;
const baseTeleport_1 = require("../baseTeleport");
class PodTeleport extends baseTeleport_1.BaseTeleportCommand {
    constructor() {
        super(...arguments);
        this.workloadKind = 'Pod';
    }
}
exports.PodTeleport = PodTeleport;
PodTeleport.description = 'Teleport your local machine so feels like you are in a Pod';
PodTeleport.examples = [
    'czctl pod teleport halyard-backend',
];
PodTeleport.flags = baseTeleport_1.BaseTeleportCommand.flags;
//# sourceMappingURL=teleport.js.map