"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GkeContainerClient = void 0;
const tslib_1 = require("tslib");
const BaseClient_1 = require("./BaseClient");
class GkeContainerClient extends BaseClient_1.BaseClient {
    constructor() {
        super(...arguments);
        this.createCluster = (projectId, zoneId, spec) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const response = yield this.post(`projects/${projectId}/locations/${zoneId}/clusters`, spec);
            return response.data;
        });
        this.deleteCluster = (targetUrl) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const response = yield this.delete(targetUrl);
            return response;
        });
        this.getClusters = (projectId, zoneId) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const response = yield this.get(`projects/${projectId}/locations/${zoneId}/clusters`);
            return response.data;
        });
        this.getCluster = (targetUrl) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const response = yield this.get(targetUrl);
            return response.data;
        });
        this.waitForCluster = (targetUrl) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            function sleep(ms) {
                return new Promise(resolve => setTimeout(resolve, ms));
            }
            let clusterInfo = yield this.getCluster(targetUrl);
            while (clusterInfo.status === 'PROVISIONING') {
                yield sleep(2000);
                clusterInfo = yield this.getCluster(targetUrl);
            }
            return clusterInfo;
        });
        this.getKubeOptions = (projectId, zoneId) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const response = yield this.get(`projects/${projectId}/zones/${zoneId}/serverconfig`);
            return response.data;
        });
        this.getKubeConfig = (targetUrl) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const cluster = yield this.getCluster(targetUrl);
            return this._generateKubecConfig(cluster.masterAuth.clusterCaCertificate, cluster.endpoint);
        });
        this.getRecommendedZones = (projectId) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            var _a;
            const response = yield this.get(`projects/${projectId}/locations`);
            return (_a = response.data) === null || _a === void 0 ? void 0 : _a.locations.filter(item => item.type === 'ZONE' && item.recommended);
        });
        this._generateKubecConfig = (certificate, endpoint) => ({
            apiVersion: 'v1',
            kind: 'Config',
            clusters: [{
                    cluster: {
                        'certificate-authority-data': certificate,
                        server: `https://${endpoint}`
                    },
                    name: 'gke-cluster'
                }],
            contexts: [{
                    context: {
                        cluster: 'gke-cluster',
                        user: 'gke-user'
                    },
                    name: 'gke-context'
                }],
            'current-context': 'gke-context',
            users: [{
                    name: 'gke-user',
                    user: {
                        token: this.token
                    }
                }]
        });
    }
    get apiURL() { return 'https://container.googleapis.com/v1beta1'; }
    init(token) {
        const _super = Object.create(null, {
            init: { get: () => super.init }
        });
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield _super.init.call(this, token || process.env.GKE_TOKEN);
        });
    }
}
exports.GkeContainerClient = GkeContainerClient;
//# sourceMappingURL=GkeContainerClient.js.map