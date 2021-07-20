"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppHelper = exports.AppStatuses = void 0;
const codezero_1 = require("./codezero");
exports.AppStatuses = {
    create: {
        Pending: 'Installing',
        Completed: 'Running',
        Error: 'Error'
    },
    update: {
        Pending: 'Configuring',
        Completed: 'Running',
        Error: 'Degraded'
    },
    remove: {
        Pending: 'Terminating',
        Completed: 'Terminated',
        Error: 'Degraded'
    }
};
class AppHelper extends codezero_1.CodeZeroHelper {
    constructor() {
        super(...arguments);
        this.getServiceName = (serviceObject) => Object.keys(serviceObject)[0];
    }
    get services() {
        var _a;
        if (this._services)
            return this._services;
        this.resource.spec.provisioner = this.resource.spec.provisioner || {};
        const appProvisioner = this.resource.metadata.name;
        const services = ((_a = this.resource.spec.provisioner) === null || _a === void 0 ? void 0 : _a.services) || [];
        return this._services = [
            ...services,
            { [appProvisioner]: this.resource.spec.provisioner }
        ];
    }
    get appId() { return this.resource.metadata.name; }
    get instanceId() { return `${this.namespace}-${this.name}`; }
    get tag() { var _a; return (_a = this.resource.spec.provisioner) === null || _a === void 0 ? void 0 : _a.tag; }
    get description() { var _a; return ((_a = this.resource.metadata.annotations) === null || _a === void 0 ? void 0 : _a['system.codezero.io/description']) || this.appId; }
    get edition() { var _a; return ((_a = this.resource.metadata.labels) === null || _a === void 0 ? void 0 : _a['system.codezero.io/edition']) || 'latest'; }
    get provisioner() { return this.spec.provisioner; }
    get routes() { return this.spec.routes; }
    get hasRoutes() { var _a; return (_a = this.routes) === null || _a === void 0 ? void 0 : _a.length; }
    get httpRoute() { var _a; return (_a = this.routes) === null || _a === void 0 ? void 0 : _a.find(item => item.type === 'http'); }
    get spec() { return this.resource.spec; }
    get appEdition() { return this.edition; }
    get appName() { return this.resource.metadata.name; }
    get appNamespace() { return this.resource.metadata.namespace; }
    get isNew() { return !!this.resource.metadata.uid; }
    get serviceNames() { return this.services.map(serviceObject => this.getServiceName(serviceObject)); }
    get componentLabels() {
        return Object.assign(Object.assign({}, super.componentLabels), { 'system.codezero.io/app': this.name, 'system.codezero.io/id': this.instanceId, 'system.codezero.io/edition': this.edition, 'app.kubernetes.io/name': this.name });
    }
    get appComponentMergeDocument() {
        return {
            metadata: {
                labels: this.componentLabels
            }
        };
    }
    get volumes() {
        var _a, _b;
        return (_b = (_a = this.spec) === null || _a === void 0 ? void 0 : _a.provisioner) === null || _b === void 0 ? void 0 : _b.volumes;
    }
    static volumesPath() {
        return '/spec/provisioner/volumes';
    }
    getServiceSpec(serviceName) {
        return this.getServiceObject(serviceName)[serviceName];
    }
    getServicePackage(serviceName) {
        const serviceSpec = this.getServiceSpec(serviceName);
        return serviceSpec.package;
    }
    getServiceTagPrefix(serviceName) {
        const serviceSpec = this.getServiceSpec(serviceName);
        return serviceSpec['tag-prefix'] || serviceName;
    }
    getServiceObject(serviceName) {
        return this.services.find(serviceObject => this.getServiceName(serviceObject) === serviceName) || {};
    }
    upsertLabel(labelName, labelValue) {
        this.resource.metadata.labels[labelName] = labelValue;
    }
    insertOnlyLabel(labelName, labelValue) {
        if (!this.resource.metadata.labels[labelName])
            this.resource.metadata.labels[labelName] = labelValue;
    }
}
exports.AppHelper = AppHelper;
//# sourceMappingURL=app.js.map