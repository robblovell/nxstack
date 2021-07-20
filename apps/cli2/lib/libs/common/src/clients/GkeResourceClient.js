"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GkeResourceClient = void 0;
const tslib_1 = require("tslib");
const BaseClient_1 = require("./BaseClient");
class GkeResourceClient extends BaseClient_1.BaseClient {
    constructor() {
        super(...arguments);
        this.getProjects = () => tslib_1.__awaiter(this, void 0, void 0, function* () {
            var _a;
            const response = yield this.get('projects');
            return (_a = response.data) === null || _a === void 0 ? void 0 : _a.projects;
        });
        this.hasPermissions = (projectId, permissions) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            var _b, _c;
            try {
                const result = yield this.post(`projects/${projectId}:testIamPermissions`, { permissions });
                if (((_c = (_b = result.data) === null || _b === void 0 ? void 0 : _b.permissions) === null || _c === void 0 ? void 0 : _c.length) !== permissions.length) {
                    return false;
                }
            }
            catch (ex) {
                return false;
            }
            return true;
        });
    }
    get apiURL() { return 'https://cloudresourcemanager.googleapis.com/v1'; }
    init(token) {
        const _super = Object.create(null, {
            init: { get: () => super.init }
        });
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield _super.init.call(this, token || process.env.GKE_TOKEN);
        });
    }
}
exports.GkeResourceClient = GkeResourceClient;
//# sourceMappingURL=GkeResourceClient.js.map