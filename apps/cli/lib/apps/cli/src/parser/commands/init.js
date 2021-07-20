"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InitCommand = void 0;
const tslib_1 = require("tslib");
const base_1 = require("../base");
const orchestrators_1 = require("../../orchestrators");
class InitCommand extends base_1.BaseCommand {
    constructor() {
        super(...arguments);
        this.flagMaps = Object.assign({}, base_1.BaseCommand.flagMaps);
    }
    go() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield new orchestrators_1.Init(this.params).apply();
        });
    }
}
exports.InitCommand = InitCommand;
InitCommand.description = 'Initialize czctl for your current environment and context.';
InitCommand.examples = [
    'sudo czctl init',
];
InitCommand.flags = Object.assign({}, base_1.BaseCommand.flags);
InitCommand.args = [];
//# sourceMappingURL=init.js.map