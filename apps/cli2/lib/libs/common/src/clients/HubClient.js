"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HubClient = void 0;
const tslib_1 = require("tslib");
const BaseClient_1 = require("./BaseClient");
class HubClient extends BaseClient_1.BaseClient {
    get apiURL() { return (process.env.HUB_SERVER_URL || 'https://codezero.io') + '/api'; }
    init(token, privateKey, jwkId) {
        const _super = Object.create(null, {
            init: { get: () => super.init }
        });
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield _super.init.call(this, token || process.env.HUB_TOKEN, privateKey || process.env.CLUSTER_KEY, jwkId || process.env.CLUSTER_ID);
        });
    }
    getMe() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const res = yield this.get('accounts');
            return this.toData(res).find((user) => user.type === 'p');
        });
    }
    getApps() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const res = yield this.get('apps');
            return this.toData(res);
        });
    }
    createApp(app) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const res = yield this.post('apps', app);
            return this.toData(res);
        });
    }
    getClusters() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const res = yield this.get('clusters');
            return this.toData(res);
        });
    }
    getCluster(id, params) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const res = yield this.get(`clusters/${id}`, params);
            return this.toData(res);
        });
    }
    createCluster(data) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const res = yield this.post('clusters', data);
            return this.toData(res);
        });
    }
    patchCluster(id, data) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const res = yield this.patch(`clusters/${id}`, data);
            return this.toData(res);
        });
    }
    getClusterCredentials(id, createIfNone = false) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const params = createIfNone ? { $createIfNone: true } : undefined;
            const res = yield this.get(`clusters/${id}/cert`, params);
            return this.toFirst(res);
        });
    }
    getApp(namespace, showPublic = true) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const res = yield this.get('apps', { namespace, showPublic });
            return this.toFirst(res);
        });
    }
    getAccounts(filters = null) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const res = yield this.get('accounts', filters);
            return this.toData(res);
        });
    }
    getEditions(appId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const res = yield this.get('editions', { appId });
            return this.toData(res);
        });
    }
    getAppManifest(appId, name) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const res = yield this.get('editions', { appId, name, $manifest: true });
            return this.toData(res);
        });
    }
    getAppEditionManifest(appNamespace, edition) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const res = yield this.get(`apps/${appNamespace}/editions/${edition}`);
            return this.toData(res);
        });
    }
    createEdition(edition) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const res = yield this.post('editions', edition);
            return this.toData(res);
        });
    }
    grant(type, id, perm, personId, orgId, name) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const res = (personId) ?
                yield this.post(`permissions/${type}/${id}`, { perm, personId }) :
                yield this.post(`permissions/${type}/${id}`, { perm, teamId: { orgId, name } });
            return this.toData(res);
        });
    }
    getPermissions(type, id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const res = yield this.get(`permissions/${type}/${id}`, { $perms: true });
            return this.toData(res);
        });
    }
    transferOwnershipTo(type, id, toAccountId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const res = yield this.post(`permissions/${type}/${id}`, { toAccountId });
            return this.toData(res);
        });
    }
    getStatus() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const res = yield this.get('');
            return this.toData(res);
        });
    }
    upsertFromManifest(manifest) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const res = yield this.post('apps', { manifest });
            return this.toData(res);
        });
    }
}
exports.HubClient = HubClient;
//# sourceMappingURL=HubClient.js.map