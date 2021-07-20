"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CloseSession = void 0;
const tslib_1 = require("tslib");
const command_1 = require("@oclif/command");
const orchestrators_1 = require("../../../orchestrators");
const base_1 = require("../../base");
const kubernetes_1 = require("../../kubernetes");
class CloseSession extends base_1.BaseCommand {
    constructor() {
        super(...arguments);
        this.flagMaps = Object.assign({}, kubernetes_1.KubernetesCommand.flagMaps);
    }
    go() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const orchestrator = new orchestrators_1.SessionOrchestrator(this.params);
            yield orchestrator.closeSession();
        });
    }
}
exports.CloseSession = CloseSession;
CloseSession.description = 'Close active sessions';
CloseSession.examples = [
    '$ czctl session close',
    '$ czctl session close --purge'
];
CloseSession.flags = Object.assign(Object.assign({}, kubernetes_1.KubernetesCommand.flags), { purge: command_1.flags.boolean({ char: 'p', description: 'Clear knowledge of all sessions', hidden: true }), all: command_1.flags.boolean({ char: 'a', description: 'Gracefully close all sessions' }) });
//# sourceMappingURL=close.js.map