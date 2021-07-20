"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApplyMixin = void 0;
const tslib_1 = require("tslib");
const systemPatch_1 = require("./systemPatch");
const createApplyMixin = (base) => class extends base {
    constructor() {
        super(...arguments);
        this.SYSTEM_GATEWAY_NAME = 'system-gateway';
        this.gatewayServers = [{
                port: {
                    name: 'http-istio-gateway',
                    number: 80,
                    protocol: 'HTTP'
                },
                hosts: ['*'],
                tls: {
                    httpsRedirect: true
                }
            },
            {
                port: {
                    name: 'https-istio-gateway',
                    number: 443,
                    protocol: 'HTTPS'
                },
                hosts: ['*'],
                tls: {
                    mode: 'SIMPLE',
                    credentialName: 'cluster-certificate-tls'
                }
            }];
        this.traxittNamespace = {
            kind: 'Namespace',
            metadata: {
                name: 'c6o-system'
            }
        };
    }
    createApply() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            this.spec.tag = this.spec.tag || 'canary';
            yield this.provisionCRDs();
            yield this.provisionSystem();
            yield this.provisionApps();
            yield this.provisionOAuth();
            yield this.provisionDock();
            yield this.provisionGateway();
            yield this.provisionRoutes();
            yield this.provisionCertificate();
            yield this.provisionUpdate();
        });
    }
    get host() {
        const { clusterNamespace, accountName, clusterDomain } = this.spec;
        return accountName ?
            `${clusterNamespace}.${accountName}.${clusterDomain}` :
            `${clusterNamespace}.${clusterDomain}`;
    }
    get systemServerUrl() {
        return `${this.spec.protocol}://${this.host}`;
    }
    get systemServerCookieDomain() {
        return `.${this.host}`;
    }
    provisionCRDs() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if ((yield this.controller.cluster.version()).gte('1.16.0'))
                yield this.controller.cluster
                    .begin('Provision c6o CRDs for apiextensions.k8s.io/v1')
                    .upsertFile('../../k8s/crds/dock.v1.yaml')
                    .upsertFile('../../k8s/crds/oauth.v1.yaml')
                    .upsertFile('../../k8s/crds/tasks.v1.yaml')
                    .upsertFile('../../k8s/crds/users.v1.yaml')
                    .end();
            else
                yield this.controller.cluster
                    .begin('Provision c6o CRDs for apiextensions.k8s.io/v1beta1')
                    .upsertFile('../../k8s/crds/dock.v1beta1.yaml')
                    .upsertFile('../../k8s/crds/oauth.v1beta1.yaml')
                    .upsertFile('../../k8s/crds/tasks.v1beta1.yaml')
                    .upsertFile('../../k8s/crds/users.v1beta1.yaml')
                    .end();
        });
    }
    provisionSystem() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const options = {
                tag: this.spec.tag,
                clusterId: this.spec.clusterId,
                clusterKey: this.spec.clusterKey,
                hubServerURL: this.spec.hubServerURL,
                systemServerURL: this.systemServerUrl,
                host: this.host,
                jwtKey: this.spec.clusterKey,
                clusterNamespace: this.spec.clusterNamespace,
                clusterDomain: this.spec.clusterDomain,
                systemServerCookieDomain: this.systemServerCookieDomain,
                featureAuthKey: this.spec.featureAuthKey,
                stripePublishableKey: this.spec.stripePublishableKey,
            };
            yield this.controller.cluster
                .begin('Provision system server')
                .upsertFile('../../k8s/clusterrole.yaml')
                .addOwner(this.controller.resource)
                .upsertFile('../../k8s/server.yaml', options)
                .patch(this.traxittNamespace, systemPatch_1.c6oNamespacePatch)
                .upsertFile('../../k8s/ns-default.yaml')
                .end();
        });
    }
    provisionOAuth() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield this.controller.cluster
                .begin('Provision CodeZero OAuth')
                .addOwner(this.controller.resource)
                .upsertFile('../../k8s/oauth.yaml', { hubServerURL: this.spec.hubServerURL })
                .end();
        });
    }
    provisionDock() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield this.controller.cluster
                .begin('Provision default Dock')
                .addOwner(this.controller.resource)
                .upsertFile('../../k8s/dock.yaml')
                .end();
        });
    }
    provisionApps() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const options = {
                tag: this.spec.tag,
                hubServerURL: this.spec.hubServerURL
            };
            yield this.controller.cluster
                .begin('Provision Apps')
                .addOwner(this.controller.resource)
                .upsertFile('../../k8s/marina.yaml', options)
                .upsertFile('../../k8s/store.yaml', options)
                .upsertFile('../../k8s/harbourmaster.yaml', options)
                .upsertFile('../../k8s/lifeboat.yaml', options)
                .upsertFile('../../k8s/navstation.yaml', options)
                .upsertFile('../../k8s/apps.yaml', options)
                .clearOwners()
                .upsertFile('../../k8s/istio.yaml', options)
                .eachFile((appDoc) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                yield this.postCreateApp(appDoc);
            }), '../../k8s/apps.yaml', options)
                .end();
        });
    }
    provisionGateway() {
        var _a, _b;
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            (_a = this.controller.status) === null || _a === void 0 ? void 0 : _a.push('Provision system gateway');
            const istioProvisioner = yield this.getIstioProvisioner();
            const result = yield istioProvisioner.createGateway('c6o-system', this.SYSTEM_GATEWAY_NAME, this.gatewayServers);
            result.throwIfError();
            (_b = this.controller.status) === null || _b === void 0 ? void 0 : _b.pop();
        });
    }
    provisionRoutes() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const host = this.host.split(".").join("\\.");
            yield this.controller.cluster
                .begin('Provision messaging sub-system')
                .addOwner(this.controller.resource)
                .upsertFile('../../k8s/virtualServices.yaml', { host })
                .end();
        });
    }
    provisionMessaging() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield this.controller.cluster
                .begin('Provision messaging sub-system')
                .addOwner(this.controller.resource)
                .upsertFile('../../k8s/publisher.yaml', { tag: this.spec.tag })
                .upsertFile('../../k8s/subscriber.yaml', { tag: this.spec.tag })
                .end();
        });
    }
    provisionCertificate() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const schedule = process.env.NODE_ENV === 'development'
                ? '*/5 * * * *'
                : `${Math.floor(Math.random() * 59)} ${Math.floor(Math.random() * 23)} * * 1`;
            const options = {
                tag: this.spec.tag,
                accountName: this.spec.accountName,
                hubServerURL: this.spec.hubServerURL,
                clusterId: this.spec.clusterId,
                clusterKey: this.spec.clusterKey,
                backoffLimit: 5,
                schedule
            };
            yield this.controller.cluster
                .begin('Remove possible existing certificate cron jobs to avoid mutations')
                .deleteFile('../../k8s/ssl-recurring-job.yaml', options)
                .deleteFile('../../k8s/ssl-setup-job.yaml', options)
                .end();
            yield this.controller.cluster
                .begin('Provision certificate cron jobs')
                .upsertFile('../../k8s/ssl-recurring-job.yaml', options)
                .upsertFile('../../k8s/ssl-setup-job.yaml', options)
                .end();
        });
    }
    provisionUpdate() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const schedule = `${Math.floor(Math.random() * 59)} ${Math.floor(Math.random() * 23)} * * 1`;
            const options = {
                tag: this.spec.tag,
                hubServerURL: this.spec.hubServerURL,
                clusterId: this.spec.clusterId,
                clusterKey: this.spec.clusterKey,
                backoffLimit: 5,
                schedule
            };
            yield this.controller.cluster
                .begin('Provision update cron job')
                .upsertFile('../../k8s/update-recurring-job.yaml', options)
                .end();
        });
    }
};
exports.createApplyMixin = createApplyMixin;
//# sourceMappingURL=createApply.js.map