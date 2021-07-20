"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getClient = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@c6o/common");
const logger_1 = require("@c6o/logger");
const debug = logger_1.createDebug();
const getClient = () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    try {
        const client = new common_1.NgrokClient();
        if (!(yield client.isReady()))
            throw new Error('Tunnel client is not ready.');
        return client;
    }
    catch (ex) {
        debug('No client %o', ex);
        return null;
    }
});
exports.getClient = getClient;
//# sourceMappingURL=client.js.map