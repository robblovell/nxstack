"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListSession = void 0;
const tslib_1 = require("tslib");
const command_1 = require("@oclif/command");
const orchestrators_1 = require("../../../orchestrators");
const base_1 = require("../../base");
const kubernetes_1 = require("../../kubernetes");
class ListSession extends base_1.BaseCommand {
    constructor() {
        super(...arguments);
        this.flagMaps = Object.assign({}, kubernetes_1.KubernetesCommand.flagMaps);
    }
    go() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const orchestrator = new orchestrators_1.SessionOrchestrator(this.params);
            yield orchestrator.listSessions();
        });
    }
}
exports.ListSession = ListSession;
ListSession.description = 'Lists current active sessions';
ListSession.examples = [
    '$ czctl session list',
];
ListSession.flags = Object.assign(Object.assign({}, kubernetes_1.KubernetesCommand.flags), { detail: command_1.flags.boolean({ char: 'd', description: 'Show sub-session information' }) });
//# sourceMappingURL=list.js.map