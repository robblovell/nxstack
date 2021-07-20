"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHubClient = void 0;
const common_1 = require("@c6o/common");
const base_1 = require("../auth/base");
const getHubClient = () => {
    const auth = new base_1.AuthPerformer();
    const hubClient = new common_1.HubClient();
    hubClient.tokenPromise = auth.getToken();
    return hubClient;
};
exports.getHubClient = getHubClient;
//# sourceMappingURL=hubClient.js.map