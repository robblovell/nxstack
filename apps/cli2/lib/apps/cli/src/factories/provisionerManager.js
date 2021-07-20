"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProvisionerManager = void 0;
const provisioner_1 = require("@c6o/provisioner");
const kubernetes_1 = require("./kubernetes");
const status_1 = require("./status");
const getProvisionerManager = (reporter, params) => {
    const cluster = params ? kubernetes_1.getCluster(params) : undefined;
    const manager = new provisioner_1.ProvisionerManager({ cluster });
    const status = status_1.getStatus(reporter, manager);
    manager.status = status;
    return manager;
};
exports.getProvisionerManager = getProvisionerManager;
//# sourceMappingURL=provisionerManager.js.map