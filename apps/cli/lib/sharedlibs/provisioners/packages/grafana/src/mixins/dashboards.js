"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dashboardApiMixin = void 0;
const tslib_1 = require("tslib");
const yaml = tslib_1.__importStar(require("js-yaml"));
const dashboardApiMixin = (base) => class extends base {
    constructor() {
        super(...arguments);
        this.addConfigMaps = [];
        this.removeConfigMaps = [];
        this.datasources = [];
        this.removeDatasources = [];
        this.apiConfigMapAppMetadata = (appNamespace, appName) => ({
            'system.codezero.io/app-name': appName,
            'system.codezero.io/app-namespace': appNamespace
        });
        this.getGrafanaDeployment = (namespace) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const deployment = {
                apiVersion: 'apps/v1',
                kind: 'Deployment',
                metadata: {
                    namespace,
                    name: 'grafana',
                    labels: {
                        name: 'grafana'
                    }
                }
            };
            return yield this.controller.cluster.read(deployment);
        });
    }
    apiDashboardConfigMap(dashboardName, dashboardSpec) {
        const configMap = {
            kind: 'ConfigMap',
            metadata: {
                namespace: this.runningDeployment.metadata.namespace,
                name: `${this.appNamespace}-${this.appName}-${dashboardName}`,
                labels: Object.assign({ 'system.codezero.io/managed-by': 'grafana' }, this.apiConfigMapAppMetadata(this.appNamespace, this.appName))
            }
        };
        if (dashboardSpec) {
            configMap.data = {
                [dashboardName + '.json']: dashboardSpec
            };
        }
        return configMap;
    }
    mainConfigMap(namespace) {
        return {
            kind: 'ConfigMap',
            metadata: {
                namespace,
                name: 'grafana-provider-dashboards'
            }
        };
    }
    clearConfig(namespace, appNamespace, appName) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let result = yield this.controller.cluster.list({
                kind: 'ConfigMap',
                metadata: {
                    namespace,
                    labels: Object.assign({}, this.apiConfigMapAppMetadata(appNamespace, appName))
                }
            });
            result.throwIfError();
            for (const cm of result.each('ConfigMap')) {
                result = yield this.controller.cluster.delete(cm);
                result.throwIfError();
            }
            result = yield this.getGrafanaDeployment(namespace);
            result.throwIfError();
            this.runningDeployment = result.as();
            yield this.removeFoldersDataSources(namespace, appNamespace, appName);
            yield this.removeVolumeMounts(appNamespace, appName);
            yield this.restartGrafana();
            delete this.runningDeployment;
        });
    }
    removeFoldersDataSources(namespace, appNamespace, appName) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let result = yield this.controller.cluster.read(this.mainConfigMap(namespace));
            result.throwIfError();
            const configMap = result.as();
            const ownerPrefix = `${appNamespace}-${appName}`;
            const dbProviders = yaml.load(configMap.data['dashboardproviders.yaml']);
            dbProviders.providers = dbProviders.providers || [];
            dbProviders.providers = dbProviders.providers.filter(entry => entry.folder !== ownerPrefix);
            const dbSources = yaml.load(configMap.data['datasources.yaml']);
            dbSources.datasources = dbSources.datasources || [];
            dbSources.datasources = dbSources.datasources.filter(entry => !entry.name.startsWith(ownerPrefix));
            result = yield this.controller.cluster.patch(configMap, {
                data: {
                    'dashboardproviders.yaml': yaml.dump(dbProviders),
                    'datasources.yaml': yaml.dump(dbSources)
                }
            });
            result.throwIfError();
        });
    }
    removeVolumeMounts(appNamespace, appName) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const volumeName = `dashboards-${appNamespace}-${appName}`;
            let volumeArray = this.runningDeployment.spec.template.spec.volumes;
            volumeArray = volumeArray.filter(vol => !vol.name.startsWith(volumeName));
            this.runningDeployment.spec.template.spec.volumes = volumeArray;
            let volumeMountArray = this.runningDeployment.spec.template.spec.containers[0].volumeMounts;
            volumeMountArray = volumeMountArray.filter(vol => !vol.name.startsWith(volumeName));
            this.runningDeployment.spec.template.spec.containers[0].volumeMounts = volumeMountArray;
            this.runningDeployment.apiVersion = 'apps/v1';
            this.runningDeployment.kind = 'Deployment';
            const result = yield this.controller.cluster.patch(this.runningDeployment, this.runningDeployment);
            result.throwIfError();
        });
    }
    beginConfig(namespace, appNamespace, appName) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (this.runningDeployment)
                throw Error('There is already a running dashboard transaction');
            const result = yield this.getGrafanaDeployment(namespace);
            result.throwIfError();
            this.runningDeployment = result.as();
            this.appNamespace = appNamespace;
            this.appName = appName;
        });
    }
    updateConfig() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let result = yield this.controller.cluster.read(this.mainConfigMap(this.runningDeployment.metadata.namespace));
            result.throwIfError();
            const configMap = result.as();
            const folder = `${this.appNamespace}-${this.appName}`;
            let modified = false;
            const dbProviders = yaml.load(configMap.data['dashboardproviders.yaml']);
            dbProviders.providers = dbProviders.providers || [];
            const index = dbProviders.providers.findIndex(entry => entry.folder == folder);
            if (index === -1) {
                dbProviders.providers.push({
                    folder,
                    name: folder,
                    disableDeletion: false,
                    options: {
                        path: `/var/lib/grafana/dashboards/${folder}`
                    },
                    orgId: 1,
                    type: 'file'
                });
                modified = true;
            }
            const dbSources = yaml.load(configMap.data['datasources.yaml']);
            dbSources.datasources = dbSources.datasources || [];
            for (const source of this.datasources) {
                const index = dbSources.datasources.findIndex(entry => entry.name === source.name);
                if (index === -1) {
                    dbSources.datasources.push(source);
                    modified = true;
                }
            }
            for (const sourceName of this.removeDatasources) {
                const index = dbSources.datasources.findIndex(entry => entry.name === sourceName);
                if (index !== -1) {
                    dbSources.datasources.splice(index, 1);
                    modified = true;
                }
            }
            if (modified) {
                result = yield this.controller.cluster.patch(result.as(), {
                    data: {
                        'dashboardproviders.yaml': yaml.dump(dbProviders),
                        'datasources.yaml': yaml.dump(dbSources)
                    }
                });
                result.throwIfError();
            }
            return modified;
        });
    }
    addDataSource(name, spec) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            this.datasources = this.datasources || [];
            spec.name = `${this.appNamespace}-${this.appName}-${name}`;
            this.datasources.push(spec);
            return spec.name;
        });
    }
    removeDataSource(name) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            this.removeDatasources = this.removeDatasources || [];
            this.removeDatasources.push(`${this.appNamespace}-${this.appName}-${name}`);
        });
    }
    addDashboard(dashboardName, dashBoardSpec) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            this.addConfigMaps.push(this.apiDashboardConfigMap(dashboardName, dashBoardSpec));
            const volumeName = `dashboards-${this.appNamespace}-${this.appName}-${dashboardName}`;
            const volume = {
                name: volumeName,
                configMap: {
                    name: `${this.appNamespace}-${this.appName}-${dashboardName}`
                }
            };
            const volumeMount = {
                name: volumeName,
                mountPath: `/var/lib/grafana/dashboards/${this.appNamespace}-${this.appName}/${dashboardName}.json`,
                subPath: `${dashboardName}.json`,
                readOnly: true
            };
            const volumeArray = this.runningDeployment.spec.template.spec.volumes;
            let index = volumeArray.findIndex(vol => vol.name == volumeName);
            if (index === -1)
                volumeArray.push(volume);
            const volumeMountArray = this.runningDeployment.spec.template.spec.containers[0].volumeMounts;
            index = volumeMountArray.findIndex(vol => vol.name == volumeName);
            if (index === -1)
                volumeMountArray.push(volumeMount);
        });
    }
    removeDashboard(dashboardName) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            this.removeConfigMaps.push(this.apiDashboardConfigMap(dashboardName));
            const volumeName = `dashboards-${this.appNamespace}-${this.appName}-${dashboardName}`;
            const volumeArray = this.runningDeployment.spec.template.spec.volumes;
            let index = volumeArray.findIndex(vol => vol.name == volumeName);
            if (index !== -1)
                volumeArray.splice(index, 1);
            const volumeMountArray = this.runningDeployment.spec.template.spec.containers[0].volumeMounts;
            index = volumeMountArray.findIndex(vol => vol.name == volumeName);
            if (index !== -1)
                volumeMountArray.splice(index, 1);
        });
    }
    endConfig() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let restart = false;
            for (const configMap of this.addConfigMaps) {
                const result = yield this.controller.cluster.upsert(configMap);
                if (result.error)
                    throw result.error;
                restart = true;
            }
            for (const configMap of this.removeConfigMaps) {
                const result = yield this.controller.cluster.delete(configMap);
                if (result.error)
                    if (result.error.code !== 404)
                        throw result.error;
                restart = true;
            }
            if (yield this.updateConfig()) {
                restart = true;
            }
            if (restart) {
                const result = yield this.controller.cluster.patch(this.runningDeployment, this.runningDeployment);
                result.throwIfError();
                yield this.restartGrafana();
            }
            this.runningDeployment = null;
        });
    }
    restartGrafana() {
        var _a;
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const previousCount = ((_a = this.runningDeployment.spec) === null || _a === void 0 ? void 0 : _a.replicas) || 0;
            yield this.controller.cluster.patch(this.runningDeployment, { spec: { replicas: 0 } });
            yield this.controller.cluster.patch(this.runningDeployment, { spec: { replicas: previousCount } });
        });
    }
};
exports.dashboardApiMixin = dashboardApiMixin;
//# sourceMappingURL=dashboards.js.map