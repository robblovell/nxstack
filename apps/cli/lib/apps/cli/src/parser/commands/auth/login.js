"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthLogin = void 0;
const tslib_1 = require("tslib");
const command_1 = require("@oclif/command");
const login_1 = require("../../../performers/auth/login");
const base_1 = require("../../base");
const status_1 = require("../../../ui/status/");
const display_1 = require("../../../ui/display");
const provisionerManager_1 = require("../../../factories/provisionerManager");
class AuthLogin extends base_1.BaseCommand {
    go() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const performer = new login_1.AuthLoginPerformer(this.params);
            const reporter = new display_1.CLIReporter({ quiet: false }, process.stdout.write, process.stderr.write);
            const provisionerManager = provisionerManager_1.getProvisionerManager(reporter);
            performer.status = new status_1.CLIStatus(reporter, provisionerManager);
            yield performer.perform();
        });
    }
}
exports.AuthLogin = AuthLogin;
AuthLogin.hidden = true;
AuthLogin.description = 'Log in to the CodeZero Hub';
AuthLogin.flags = Object.assign(Object.assign({}, base_1.BaseCommand.flags), { token: command_1.flags.string({ char: 't', description: 'Use the auth token provided', required: false }), yes: command_1.flags.boolean({ char: 'y', description: 'If logged in, suppress confirmation prompt', required: false }) });
//# sourceMappingURL=login.js.map