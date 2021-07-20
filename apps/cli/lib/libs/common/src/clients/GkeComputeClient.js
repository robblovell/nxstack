"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GkeComputeClient = void 0;
const tslib_1 = require("tslib");
const BaseClient_1 = require("./BaseClient");
class GkeComputeClient extends BaseClient_1.BaseClient {
    constructor() {
        super(...arguments);
        this.getMachineTypes = (projectId, zoneId, vmSeriesPrefix) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const response = yield this.get(`projects/${projectId}/zones/${zoneId}/machineTypes`);
            return (_b = (_a = response.data) === null || _a === void 0 ? void 0 : _a.items) === null || _b === void 0 ? void 0 : _b.filter(item => { var _a; return !vmSeriesPrefix || ((_a = item.name) === null || _a === void 0 ? void 0 : _a.startsWith(vmSeriesPrefix)); });
        });
    }
    get apiURL() { return 'https://compute.googleapis.com/compute/v1'; }
    init(token) {
        const _super = Object.create(null, {
            init: { get: () => super.init }
        });
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield _super.init.call(this, token || process.env.GKE_TOKEN);
        });
    }
}
exports.GkeComputeClient = GkeComputeClient;
//# sourceMappingURL=GkeComputeClient.js.map