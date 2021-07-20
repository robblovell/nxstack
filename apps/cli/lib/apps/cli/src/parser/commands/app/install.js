"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppInstall = void 0;
const tslib_1 = require("tslib");
const command_1 = require("@oclif/command");
const base_1 = require("../../base");
const kubernetes_1 = require("../../kubernetes");
class AppInstall extends base_1.BaseCommand {
    constructor() {
        super(...arguments);
        this.flagMaps = Object.assign(Object.assign({}, kubernetes_1.KubernetesCommand.flagMaps), { 'spec-only': 'specOnly' });
    }
    go() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            throw ('Not Implemented yet.');
        });
    }
}
exports.AppInstall = AppInstall;
AppInstall.hidden = true;
AppInstall.description = 'Install an Application from the CodeZero Library';
AppInstall.examples = [
    '$ czctl app install <appName>',
];
AppInstall.flags = Object.assign(Object.assign({}, kubernetes_1.KubernetesCommand.flags), { registry: command_1.flags.string({ char: 'r', description: 'NPM Registry to use to obtain provisioners.' }), 'spec-only': command_1.flags.boolean({
        char: 's',
        dependsOn: ['local'],
        description: 'Do not install - just show the spec. Only works with --local',
    }), namespace: command_1.flags.string({ char: 'n', description: 'Namespace for the operation', }), local: command_1.flags.boolean({
        char: 'l',
        description: 'Run the installation locally.',
    }) });
AppInstall.args = [{
        name: 'manifest',
        description: 'The YAML manifest file of the application.',
    }];
//# sourceMappingURL=install.js.map