"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DigitalOceanClient = void 0;
const tslib_1 = require("tslib");
const BaseClient_1 = require("./BaseClient");
class DigitalOceanClient extends BaseClient_1.BaseClient {
    constructor() {
        super(...arguments);
        this.createCluster = (spec) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            var _a;
            const response = yield this.post('kubernetes/clusters', spec);
            return (_a = response.data) === null || _a === void 0 ? void 0 : _a['kubernetes_cluster'];
        });
        this.deleteCluster = (id) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const response = yield this.delete(`kubernetes/clusters/${id}`);
            return response;
        });
        this.getClusters = () => tslib_1.__awaiter(this, void 0, void 0, function* () {
            var _b;
            const response = yield this.get('kubernetes/clusters');
            return (_b = response.data) === null || _b === void 0 ? void 0 : _b['kubernetes_clusters'];
        });
        this.getCluster = (clusterId) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            var _c;
            const response = yield this.get(`kubernetes/clusters/${clusterId}`);
            return (_c = response.data) === null || _c === void 0 ? void 0 : _c['kubernetes_cluster'];
        });
        this.waitForCluster = (clusterId) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            var _d;
            function sleep(ms) {
                return new Promise(resolve => setTimeout(resolve, ms));
            }
            let clusterInfo = yield this.getCluster(clusterId);
            while (((_d = clusterInfo.status) === null || _d === void 0 ? void 0 : _d.state) === 'provisioning') {
                yield sleep(2000);
                clusterInfo = yield this.getCluster(clusterId);
            }
            return clusterInfo;
        });
        this.getKubeOptions = () => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const response = yield this.get('kubernetes/options');
            return response.data;
        });
        this.getKubeConfig = (clusterId) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const response = yield this.get(`kubernetes/clusters/${clusterId}/kubeconfig`);
            return response.data;
        });
        this.getAccount = () => tslib_1.__awaiter(this, void 0, void 0, function* () {
            var _e;
            const response = yield this.get('account');
            return (_e = response.data) === null || _e === void 0 ? void 0 : _e.account;
        });
        this.getBalance = () => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const response = yield this.get('customers/my/balance');
            return response.data;
        });
    }
    get apiURL() { return 'https://api.digitalocean.com/v2'; }
    init(token) {
        const _super = Object.create(null, {
            init: { get: () => super.init }
        });
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield _super.init.call(this, token || process.env.DO_TOKEN);
        });
    }
}
exports.DigitalOceanClient = DigitalOceanClient;
//# sourceMappingURL=DigitalOceanClient.js.map