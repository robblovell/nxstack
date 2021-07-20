"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AksClient = void 0;
const tslib_1 = require("tslib");
const BaseClient_1 = require("./BaseClient");
class AksClient extends BaseClient_1.BaseClient {
    constructor() {
        super(...arguments);
        this.isReady = false;
        this.waitForReady = () => tslib_1.__awaiter(this, void 0, void 0, function* () {
            while (!this.isReady) {
                yield this.sleep(250);
            }
        });
        this.refreshToken = (refresh, clientId, clientSecret) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            var _a;
            const params = new URLSearchParams();
            params.append('refresh_token', refresh);
            params.append('grant_type', 'refresh_token');
            params.append('client_id', clientId);
            params.append('scope', 'https://management.azure.com/user_impersonation');
            params.append('client_secret', clientSecret);
            const response = yield this.post('https://login.microsoftonline.com/organizations/oauth2/v2.0/token', params, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
            this.token = (_a = response.data) === null || _a === void 0 ? void 0 : _a.access_token;
            this.isReady = true;
        });
        this.getSubscriptions = () => tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield this.waitForReady();
            const response = yield this.get(`/subscriptions/?api-version=${this.resourceApiVersion}`);
            return response.data.value;
        });
        this.getResourceGroups = (subscriptionId) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const response = yield this.get(`/subscriptions/${subscriptionId}/resourceGroups/?api-version=${this.resourceApiVersion}`);
            return response.data.value;
        });
        this.getLocations = (subscriptionId) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            var _b;
            const response = yield this.get(`/subscriptions/${subscriptionId}/locations/?api-version=${this.resourceApiVersion}`);
            return (_b = response.data) === null || _b === void 0 ? void 0 : _b.value.filter(item => { var _a; return ((_a = item.metadata) === null || _a === void 0 ? void 0 : _a.regionCategory) === 'Recommended'; });
        });
        this.getMachineTypes = (subscriptionId, locationCode, vmSeriesPrefix) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            var _c;
            const response = yield this.get(`/subscriptions/${subscriptionId}/providers/Microsoft.Compute/skus/?api-version=${this.resourceApiVersion}&$filter=location eq '${locationCode}'`);
            return (_c = response.data) === null || _c === void 0 ? void 0 : _c.value.filter(item => { var _a; return item.resourceType === 'virtualMachines' && item.tier === 'Standard' && (!vmSeriesPrefix || ((_a = item.size) === null || _a === void 0 ? void 0 : _a.startsWith(vmSeriesPrefix))); });
        });
        this.createCluster = (subscriptionId, resourceGroupId, name, spec) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const response = yield this.put(`${resourceGroupId}/providers/Microsoft.ContainerService/managedClusters/${name}?api-version=${this.clusterApiVersion}`, spec);
            return response.data;
        });
        this.deleteCluster = (targetUrl) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const response = yield this.delete(`${targetUrl}/?api-version=${this.clusterApiVersion}`);
            return response;
        });
        this.getClusters = (subscriptionId, resourceGroupId) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const response = yield this.get(`/subscriptions/${subscriptionId}/resourceGroups/${resourceGroupId}/providers/Microsoft.ContainerService/managedClusters/?api-version=${this.clusterApiVersion}`);
            return response.data;
        });
        this.getCluster = (targetUrl) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const response = yield this.get(`${targetUrl}/?api-version=${this.clusterApiVersion}`);
            return response.data;
        });
        this.waitForCluster = (targetUrl) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            function sleep(ms) {
                return new Promise(resolve => setTimeout(resolve, ms));
            }
            let clusterInfo = yield this.getCluster(targetUrl);
            while (clusterInfo.properties.provisioningState === 'Creating') {
                yield sleep(2000);
                clusterInfo = yield this.getCluster(targetUrl);
            }
            return clusterInfo;
        });
        this.getKubeConfig = (targetUrl) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            var _d, _e;
            const cluster = yield this.post(`${targetUrl}/listClusterUserCredential/?api-version=${this.clusterApiVersion}`);
            const kubeConfig = (_e = (_d = cluster.data.kubeconfigs) === null || _d === void 0 ? void 0 : _d[0]) === null || _e === void 0 ? void 0 : _e.value;
            return Buffer.from(kubeConfig, 'base64').toString();
        });
    }
    get apiURL() { return 'https://management.azure.com'; }
    get resourceApiVersion() { return '2021-01-01'; }
    get clusterApiVersion() { return '2021-02-01'; }
    init(token) {
        const _super = Object.create(null, {
            init: { get: () => super.init }
        });
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield _super.init.call(this, token || process.env.AKS_TOKEN);
        });
    }
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}
exports.AksClient = AksClient;
//# sourceMappingURL=AksClient.js.map