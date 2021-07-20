"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Resolver = void 0;
const tslib_1 = require("tslib");
const kubeclient_contracts_1 = require("@c6o/kubeclient-contracts");
const common_1 = require("@c6o/common");
const logger_1 = require("@c6o/logger");
const common_2 = require("@provisioner/common");
const factory_1 = require("./factory");
const debug = logger_1.createDebug();
class Resolver {
    constructor(adapter) {
        this.adapter = adapter;
    }
    get provisionerFactory() {
        if (this._provisionerFactory)
            return this._provisionerFactory;
        this._provisionerFactory = new factory_1.ProvisionerFactory();
        this._provisionerFactory.status = this.adapter.status;
        return this._provisionerFactory;
    }
    getProvisioner(nameSpaceOrParamsOrResource, nameOrServiceName) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (typeof nameSpaceOrParamsOrResource === 'string' &&
                (!nameOrServiceName || typeof nameOrServiceName !== 'string'))
                throw new Error(`Cannot determine provisioner for namespace ${nameOrServiceName} because the app name was not provided or is the wrong type`);
            const appResource = kubeclient_contracts_1.ResourceHelper.isResource(nameSpaceOrParamsOrResource) ?
                nameSpaceOrParamsOrResource :
                typeof nameSpaceOrParamsOrResource === 'string' ?
                    yield common_2.AppHelper
                        .from(nameSpaceOrParamsOrResource, nameOrServiceName)
                        .read(this.adapter.cluster) :
                    yield this.paramsToAppResource(nameSpaceOrParamsOrResource);
            if (!this.adapter.resource)
                this.adapter.resource = appResource;
            const appHelper = new common_2.AppHelper(appResource);
            const serviceName = nameSpaceOrParamsOrResource.serviceName || nameOrServiceName || appHelper.name;
            const npmPackage = appHelper.getServicePackage(serviceName) || `@provisioner/${serviceName}`;
            const provisioner = yield this.provisionerFactory.createProvisioner(npmPackage);
            provisioner.controller = this.adapter;
            provisioner.serviceName = serviceName;
            return provisioner;
        });
    }
    paramsToAppResource(params) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            params.edition = params.edition || 'latest';
            let appManifest;
            if (params.namespace) {
                try {
                    appManifest = yield common_2.AppHelper
                        .from(params.namespace, params.appName)
                        .read(this.adapter.cluster);
                }
                catch (ex) {
                    debug('Could not get manifest from cluster, trying hub %o', ex);
                }
            }
            if (!appManifest) {
                const hubClient = new common_1.HubClient();
                if (params.hubToken)
                    yield hubClient.init(params.hubToken);
                appManifest = (yield hubClient.getAppEditionManifest(params.appName, params.edition));
            }
            if (!appManifest)
                throw new Error(`Could not resolve app resource for ${params.appName}`);
            return appManifest;
        });
    }
}
exports.Resolver = Resolver;
//# sourceMappingURL=resolver.js.map