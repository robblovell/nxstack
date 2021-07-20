"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppAdapter = void 0;
const tslib_1 = require("tslib");
const logger_1 = require("@c6o/logger");
const contracts_1 = require("@provisioner/contracts");
const namespace_1 = require("../namespace");
const resolver_1 = require("./resolver");
const debug = logger_1.createDebug();
const FINALIZER = 'finalizer.app.codezero.io';
class AppAdapter {
    constructor(options, resource) {
        this.options = options;
        this.resource = resource;
        this.provisioners = [];
        this.namespaceHelper = new namespace_1.NamespacedAdapterHelper(this);
        this.resolver = new resolver_1.Resolver(this);
    }
    get status() { return this.options.status; }
    get cluster() { return this.options.cluster; }
    get action() { return this.options.action; }
    get stage() { return this.options.stage; }
    ensureAppCRD() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if ((yield this.cluster.version()).gte('1.16.0'))
                yield this.cluster
                    .begin('Provision c6o CRDs for apiextensions.k8s.io/v1')
                    .upsertFile('../../../k8s/crds/apps.v1.yaml')
                    .end();
            else
                yield this.cluster
                    .begin('Provision c6o CRDs for apiextensions.k8s.io/v1beta1')
                    .upsertFile('../../../k8s/crds/apps.v1beta1.yaml')
                    .end();
        });
    }
    load() {
        var _a, _b, _c;
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (this.resource.kind !== 'App')
                throw new Error(`Expected spec of type App but got ${this.resource.kind}`);
            if (this.resource.spec.provisioner === 'ignore')
                return;
            const appHelper = new contracts_1.AppHelper(this.resource);
            for (const serviceObject of appHelper.services) {
                const serviceName = appHelper.getServiceName(serviceObject);
                (_a = this.options.status) === null || _a === void 0 ? void 0 : _a.push(`Prepare ${this.options.action} service ${serviceName}`);
                if (!serviceObject.skip) {
                    const provisioner = yield this.resolver.getProvisioner(this.resource, serviceName);
                    provisioner.spec = appHelper.getServiceSpec(serviceName);
                    this.provisioners.push(provisioner);
                    (_b = this.options.status) === null || _b === void 0 ? void 0 : _b.pop();
                }
                else
                    (_c = this.options.status) === null || _c === void 0 ? void 0 : _c.pop(true);
            }
        });
    }
    inquire(options) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            switch (this.options.action) {
                case 'create':
                    yield this.namespaceHelper.inquireAppNamespace(options);
                    break;
            }
            yield this.doAll('Inquiring', options);
        });
    }
    validate() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield this.namespaceHelper.validateAppNamespace();
            yield this.doAll('Validating');
        });
    }
    preApply() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            switch (this.options.action) {
                case 'create':
                    yield this.preCreateApplyNamespaces();
                    yield this.ensureAppCRD();
                    break;
                case 'remove':
                    break;
            }
        });
    }
    preCreateApplyNamespaces() {
        var _a;
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield this.namespaceHelper.ensureAppNamespace();
            for (const provisioner of this.provisioners) {
                const namespace = ((_a = provisioner.spec.namespace) === null || _a === void 0 ? void 0 : _a.spec) || provisioner.spec.namespace;
                const namespaceResource = yield this.namespaceHelper.ensureNamespace(namespace);
                provisioner.serviceNamespace = namespaceResource.metadata.name;
            }
        });
    }
    apply() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield this.doAll('Applying');
            switch (this.options.action) {
                case 'create':
                    this.addFinalizer(this.resource);
                    this.addLastAppliedConfig(this.resource);
                    yield this.systemPostCreateApp(this.resource);
                    break;
                case 'update':
                    this.addLastAppliedConfig(this.resource);
                    yield this.systemPostUpdateApp(this.resource);
                    break;
                case 'remove':
                    yield this.systemPostRemoveApp(this.resource);
                    yield this.removeFinalizer(this.resource);
                    break;
            }
        });
    }
    toPending(resource) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const pendingStatus = contracts_1.AppStatuses[this.options.action].Pending;
            if (resource.status === pendingStatus)
                throw new Error(`Cannot modify App status to ${pendingStatus} because it is already in ${pendingStatus}`);
            resource.status = pendingStatus;
        });
    }
    toComplete() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const completeStatus = contracts_1.AppStatuses[this.options.action].Completed;
            return { op: 'replace', path: '/status', value: completeStatus };
        });
    }
    toError() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const errorStatus = contracts_1.AppStatuses[this.options.action].Error;
            return { status: errorStatus };
        });
    }
    error() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return false;
        });
    }
    addFinalizer(appSpec) {
        var _a, _b;
        if (((_a = appSpec.spec.provisioner) === null || _a === void 0 ? void 0 : _a.finalizer) === false) {
            (_b = this.options.status) === null || _b === void 0 ? void 0 : _b.warn('Finalizers skipped as requested! Hope you know what you are doing');
            return;
        }
        if (!appSpec.metadata)
            appSpec.metadata = {};
        if (!appSpec.metadata.finalizers) {
            appSpec.metadata.finalizers = [FINALIZER];
            return;
        }
        if (appSpec.metadata.finalizers.findIndex(f => f === FINALIZER) < 0)
            appSpec.metadata.finalizers.push(FINALIZER);
    }
    removeFinalizer(appSpec) {
        var _a, _b;
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (!((_a = appSpec.metadata) === null || _a === void 0 ? void 0 : _a.finalizers))
                return;
            appSpec.metadata.finalizers = (_b = appSpec.metadata) === null || _b === void 0 ? void 0 : _b.finalizers.filter(f => f !== FINALIZER);
        });
    }
    addLastAppliedConfig(appSpec) {
        appSpec.metadata.annotations['system.codezero.io/last-running-revision'] = appSpec.metadata.resourceVersion;
    }
    systemPostCreateApp(appSpec) {
        var _a, _b;
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            (_a = this.options.status) === null || _a === void 0 ? void 0 : _a.push('Running system post-app create');
            const systemProvisioner = yield this.resolver.getProvisioner('c6o-system', 'c6o-system');
            yield systemProvisioner.postCreateApp(appSpec);
            (_b = this.options.status) === null || _b === void 0 ? void 0 : _b.pop();
        });
    }
    systemPostUpdateApp(appSpec) {
        var _a, _b;
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            (_a = this.options.status) === null || _a === void 0 ? void 0 : _a.push('Running system post-app update');
            const systemProvisioner = yield this.resolver.getProvisioner('c6o-system', 'c6o-system');
            yield systemProvisioner.postUpdateApp(appSpec);
            (_b = this.options.status) === null || _b === void 0 ? void 0 : _b.pop();
        });
    }
    systemPostRemoveApp(appSpec) {
        var _a, _b;
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            (_a = this.options.status) === null || _a === void 0 ? void 0 : _a.push('Running system post-app remove');
            const systemProvisioner = yield this.resolver.getProvisioner('c6o-system', 'c6o-system');
            yield systemProvisioner.postRemoveApp(appSpec);
            (_b = this.options.status) === null || _b === void 0 ? void 0 : _b.pop();
        });
    }
    doAll(title, ...args) {
        var _a, _b, _c;
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const stageCap = this.stage.charAt(0).toUpperCase() + this.stage.slice(1);
            const documentKind = this.resource.kind === 'App' ? '' : this.resource.kind;
            const operation = `${this.action}${documentKind}${stageCap}`;
            for (const provisioner of this.provisioners) {
                const func = provisioner[operation];
                if (!func) {
                    if (process.env.NODE_ENV === 'development')
                        (_a = this.status) === null || _a === void 0 ? void 0 : _a.warn(`Skipping ${operation} on service ${provisioner.serviceName}`);
                    continue;
                }
                if (typeof func != 'function')
                    throw Error(`Cannot call function ${operation} on provisioner for service ${provisioner.serviceName}`);
                if (title)
                    (_b = this.status) === null || _b === void 0 ? void 0 : _b.push(`${title} ${provisioner.serviceName}`);
                yield func.apply(provisioner, args);
                if (title)
                    (_c = this.status) === null || _c === void 0 ? void 0 : _c.pop();
            }
        });
    }
}
exports.AppAdapter = AppAdapter;
//# sourceMappingURL=adapter.js.map