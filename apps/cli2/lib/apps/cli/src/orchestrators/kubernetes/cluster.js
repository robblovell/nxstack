"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Kubernetes = void 0;
const tslib_1 = require("tslib");
const client_1 = require("@c6o/kubeclient/client");
class Kubernetes {
    static ensureCluster(params, clusterKey = 'cluster') {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (params[clusterKey])
                return;
            const { kubeconfig } = params;
            const cluster = new client_1.Cluster({ kubeconfig });
            cluster.status = params.status;
            params[clusterKey] = cluster;
        });
    }
}
exports.Kubernetes = Kubernetes;
//# sourceMappingURL=cluster.js.map