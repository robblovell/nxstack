"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatefulSetTeleport = void 0;
const baseTeleport_1 = require("../baseTeleport");
class StatefulSetTeleport extends baseTeleport_1.BaseTeleportCommand {
    constructor() {
        super(...arguments);
        this.workloadKind = 'StatefulSet';
    }
}
exports.StatefulSetTeleport = StatefulSetTeleport;
StatefulSetTeleport.description = 'Teleport your local machine so feels like you are in a Stateful Set';
StatefulSetTeleport.examples = [
    'czctl statefulset teleport halyard-backend',
];
StatefulSetTeleport.flags = baseTeleport_1.BaseTeleportCommand.flags;
StatefulSetTeleport.args = baseTeleport_1.BaseTeleportCommand.args;
//# sourceMappingURL=teleport.js.map