"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppPublish = void 0;
const tslib_1 = require("tslib");
const command_1 = require("@oclif/command");
const publish_1 = require("../../../performers/app/publish");
const base_1 = require("../../base");
class AppPublish extends base_1.BaseCommand {
    go() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const appPublisher = new publish_1.AppPublishPerformer();
            yield appPublisher.orchestrate();
        });
    }
}
exports.AppPublish = AppPublish;
AppPublish.hidden = true;
AppPublish.description = 'Publishes an Application to the CodeZero Library';
AppPublish.examples = [
    '$ czctl app publish my-great-app.yaml --account=bob-the-great',
];
AppPublish.flags = Object.assign(Object.assign({}, base_1.BaseCommand.flags), { account: command_1.flags.string({ char: 'a', description: 'CodeZero ID that the application belongs to' }), forgive: command_1.flags.boolean({ char: 'l', description: 'Skip apps with parsing errors' }) });
AppPublish.args = [{
        name: 'manifest',
        required: true,
        description: 'Path to the Application manifest or manifest folder',
    }];
//# sourceMappingURL=publish.js.map