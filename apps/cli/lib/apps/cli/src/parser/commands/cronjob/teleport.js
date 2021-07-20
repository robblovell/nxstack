"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobTeleport = void 0;
const baseTeleport_1 = require("../baseTeleport");
class JobTeleport extends baseTeleport_1.BaseTeleportCommand {
    constructor() {
        super(...arguments);
        this.workloadKind = 'CronJob';
    }
}
exports.JobTeleport = JobTeleport;
JobTeleport.description = 'Teleport your local machine so feels like you are in a Cron Job';
JobTeleport.examples = [
    'czctl cronjob teleport halyard-backend',
];
JobTeleport.flags = baseTeleport_1.BaseTeleportCommand.flags;
JobTeleport.args = baseTeleport_1.BaseTeleportCommand.args;
//# sourceMappingURL=teleport.js.map