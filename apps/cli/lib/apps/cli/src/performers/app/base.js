"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppPerformer = void 0;
const hubClient_1 = require("../factories/hubClient");
const base_1 = require("../base");
class AppPerformer extends base_1.Performer {
    get hubClient() {
        if (this._hubClient)
            return this._hubClient;
        return this._hubClient = hubClient_1.getHubClient();
    }
}
exports.AppPerformer = AppPerformer;
//# sourceMappingURL=base.js.map