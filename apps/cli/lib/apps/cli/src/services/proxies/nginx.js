"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NGINXServiceProxy = void 0;
const tslib_1 = require("tslib");
const kubeclient_contracts_1 = require("@c6o/kubeclient-contracts");
const common_1 = require("@provisioner/common");
const logger_1 = require("@c6o/logger");
const contracts_1 = require("@provisioner/contracts");
const session_1 = require("../session");
const base_1 = require("../base");
const debug = logger_1.createDebug();
const pathToMultiDecoyConfig = `${base_1.projectBaseDir}/k8s/proxies/nginx/config-multi-decoy.yaml`;
const pathToDeploy = `${base_1.projectBaseDir}/k8s/proxies/nginx/deploy.yaml`;
const interceptorServiceTemplate = (namespace, name, port, signatureHash) => ({
    apiVersion: 'v1',
    kind: 'Service',
    metadata: {
        name,
        namespace,
        labels: {
            app: 'interceptor',
            'system.codezero.io/session': signatureHash,
        }
    },
    spec: {
        type: 'NodePort',
        ports: [{
                protocol: 'TCP',
                port,
                targetPort: 80,
            }],
        selector: {
            app: 'interceptor',
            'system.codezero.io/session': signatureHash,
        }
    }
});
const defaultHeaderKey = 'x_c6o_intercept';
const defaultHeaderValue = 'yes';
class NGINXServiceProxy extends session_1.ClusterSessionService {
    constructor() {
        super(...arguments);
        this.stash = (config) => (result) => tslib_1.__awaiter(this, void 0, void 0, function* () { return yield this.session.set(config, kubeclient_contracts_1.toResourceId(result.object)); });
    }
    get signature() { return `intercept-${this.params.namespace}-${this.params.remoteService}`; }
    get decoyServiceName() { return `interceptor-${this.params.remoteService}-decoy`; }
    get interceptName() { return `interceptor-${this.params.remoteService}`; }
    get addDecoy() { return !this.params.allTraffic; }
    sessionInProgress() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return false;
        });
    }
    executeCleanup() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (yield this.removeRoute())
                return false;
            const cluster = this.params.cluster;
            const cleanupProcessor = cluster.begin(`Removing intercept for ${this.params.remoteService} in ${this.params.namespace}`);
            const service = yield this.session.get('service');
            if (service)
                cleanupProcessor.delete(service);
            const decoyService = yield this.session.get('decoy-service');
            if (decoyService)
                cleanupProcessor.delete(decoyService);
            const deploy = yield this.session.get('deploy');
            if (deploy)
                cleanupProcessor.delete(deploy);
            const restoreService = yield this.session.get('restore-service');
            if (restoreService)
                cleanupProcessor.patch(restoreService.service, restoreService.ops);
            const config = yield this.session.get('config');
            if (config)
                cleanupProcessor.delete(config);
            yield cleanupProcessor.end();
            return true;
        });
    }
    removeRoute() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const currentRoutes = (yield this.session.get('routes')) || [];
            const uid = yield this.sessionUserId();
            const routes = currentRoutes.filter(route => route.uid !== uid);
            if (routes.length) {
                yield this.updateRoutes(routes);
                return true;
            }
            return false;
        });
    }
    addRoute() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const currentRoutes = (yield this.session.get('routes')) || [];
            const alreadyHadRoutes = !!currentRoutes.length;
            const value = this.headerValue;
            if (alreadyHadRoutes) {
                yield this.validateHeaderKey();
                if (currentRoutes.some(item => item.value === value))
                    throw new Error(`Cannot intercept using header value '${value}' as it is already in use. Please try another intercept header value.`);
            }
            currentRoutes.push({
                value,
                location: this.getUpstreamLocation(),
                uid: yield this.sessionUserId()
            });
            yield this.updateRoutes(currentRoutes, alreadyHadRoutes);
            return alreadyHadRoutes;
        });
    }
    updateRoutes(routes, isPatch = true) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const { cluster, namespace, remoteService, remotePort } = this.params;
            const headerKey = isPatch ?
                yield this.session.get('header-key') :
                this.headerKey;
            yield cluster.begin(`Updating routes for ${remoteService} in ${namespace}`)
                .upsertFile(pathToMultiDecoyConfig, {
                signatureHash: this.session.signatureHash,
                interceptName: this.interceptName,
                interceptNamespace: namespace,
                decoyServicePort: remotePort,
                decoyServiceName: this.decoyServiceName,
                headerKey,
                routes
            })
                .do((result) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                if (isPatch)
                    yield common_1.DeploymentHelper.from(this.params.namespace, this.interceptName).restart(cluster);
                else
                    yield this.stash('config')(result);
            }))
                .end();
            yield this.session.set('routes', routes);
        });
    }
    execute() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const { namespace, remoteService, remotePort } = this.params;
            debug('Creating cluster');
            const cluster = this.params.cluster;
            const result = yield cluster.read(this.params.remoteServiceResourceId);
            debug('Fetched service %o', result.object);
            const existingService = result.as();
            if (yield this.addRoute())
                return;
            yield this.session.set('header-key', this.headerKey);
            yield cluster.begin(`Adding intercept for ${remoteService} in ${namespace}`)
                .upsertFile(pathToDeploy, {
                signatureHash: this.session.signatureHash,
                interceptName: this.interceptName,
                interceptNamespace: namespace,
                interceptConfName: this.interceptName
            })
                .do(this.stash('deploy'))
                .do((_, processor) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                const interceptorService = interceptorServiceTemplate(namespace, remoteService, remotePort, this.session.signatureHash);
                if (existingService)
                    this.patchServiceSpec(processor, existingService, interceptorService.spec);
                else
                    processor
                        .create(interceptorService)
                        .do(this.stash('service'));
            }))
                .end();
        });
    }
    getUpstreamLocation() {
        const upstreamURL = new URL(this.params.upstreamURL);
        return upstreamURL.port ? `${upstreamURL.host}:${upstreamURL.port}` : upstreamURL.host;
    }
    validateHeaderKey() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const currentHeaderKey = yield this.session.get('header-key');
            if (!currentHeaderKey)
                return;
            const headerKey = this.headerKey;
            if (headerKey !== currentHeaderKey)
                throw new Error(`The current header intercept for this service is ${currentHeaderKey}. Cannot intercept using ${headerKey}. Please close all other intercepts.`);
        });
    }
    get headerKey() {
        var _a, _b;
        if ((_a = this.params.header) === null || _a === void 0 ? void 0 : _a.includes(':')) {
            const values = (_b = this.params.header) === null || _b === void 0 ? void 0 : _b.split(':');
            return values[0].toLowerCase();
        }
        return defaultHeaderKey;
    }
    get headerValue() {
        var _a, _b;
        if ((_a = this.params.header) === null || _a === void 0 ? void 0 : _a.includes(':')) {
            const values = (_b = this.params.header) === null || _b === void 0 ? void 0 : _b.split(':');
            return values[1].toLowerCase();
        }
        return defaultHeaderValue;
    }
    createDecoy(service) {
        const decoyService = contracts_1.ServiceHelper.from(service.metadata.namespace, this.decoyServiceName).resource;
        const _a = service.spec, { ports, selector, type } = _a, rest = tslib_1.__rest(_a, ["ports", "selector", "type"]);
        decoyService.spec = {
            selector,
            ports: ports.map(port => {
                const { nodePort } = port, rest = tslib_1.__rest(port, ["nodePort"]);
                return rest;
            }),
            type
        };
        return decoyService;
    }
    patchServiceSpec(processor, service, spec) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (this.addDecoy)
                processor
                    .create(this.createDecoy(service))
                    .do(this.stash('decoy-service'));
            processor
                .patch(service, [
                { op: 'replace', path: '/spec/selector', value: spec.selector },
                { op: 'replace', path: '/spec/ports', value: spec.ports }
            ])
                .do(() => tslib_1.__awaiter(this, void 0, void 0, function* () { return yield this.session.set('restore-service', this.restoration(service)); }));
        });
    }
    restoration(service) {
        const { apiVersion, kind } = service;
        const { name, namespace } = service.metadata;
        return {
            service: {
                kind,
                apiVersion,
                metadata: {
                    namespace,
                    name
                }
            },
            ops: [
                { op: 'replace', path: '/spec/selector', value: service.spec.selector },
                { op: 'replace', path: '/spec/ports', value: service.spec.ports }
            ]
        };
    }
}
exports.NGINXServiceProxy = NGINXServiceProxy;
NGINXServiceProxy.cleanUpKeys = ['decoy-service', 'service', 'deploy', 'config', 'restore-service'];
//# sourceMappingURL=nginx.js.map