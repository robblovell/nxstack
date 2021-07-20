"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthLogout = void 0;
const tslib_1 = require("tslib");
const logout_1 = require("../../../performers/auth/logout");
const base_1 = require("../../base");
class AuthLogout extends base_1.BaseCommand {
    go() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const performer = new logout_1.AuthLogoutPerformer();
            yield performer.perform();
        });
    }
}
exports.AuthLogout = AuthLogout;
AuthLogout.hidden = true;
AuthLogout.description = 'Log out of the CodeZero Hub';
//# sourceMappingURL=logout.js.map