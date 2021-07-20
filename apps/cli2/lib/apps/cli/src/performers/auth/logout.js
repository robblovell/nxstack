"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthLogoutPerformer = void 0;
const tslib_1 = require("tslib");
const base_1 = require("./base");
class AuthLogoutPerformer extends base_1.AuthPerformer {
    perform() {
        const _super = Object.create(null, {
            getToken: { get: () => super.getToken },
            setToken: { get: () => super.setToken }
        });
        var _a, _b;
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const token = yield _super.getToken.call(this);
            if (!token || token !== 'invalid') {
                if (!this.params.dryRun)
                    yield _super.setToken.call(this, 'invalid');
                (_a = this.status) === null || _a === void 0 ? void 0 : _a.info('You have been successfully logged out');
            }
            else
                (_b = this.status) === null || _b === void 0 ? void 0 : _b.warn('You were not logged in');
        });
    }
}
exports.AuthLogoutPerformer = AuthLogoutPerformer;
//# sourceMappingURL=logout.js.map