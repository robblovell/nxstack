"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCluster = exports.getKubeconfig = void 0;
const tslib_1 = require("tslib");
const path = tslib_1.__importStar(require("path"));
const client_1 = require("@c6o/kubeclient/client");
const getKubeconfig = (params) => {
    return (params.kubestring) ?
        { kubestring: params.kubestring } :
        { kubeconfig: params.kubeconfig ? path.resolve(params.kubeconfig) : process.env.KUBECONFIG };
};
exports.getKubeconfig = getKubeconfig;
const getCluster = (params) => new client_1.Cluster(exports.getKubeconfig(params));
exports.getCluster = getCluster;
//# sourceMappingURL=kubernetes.js.map