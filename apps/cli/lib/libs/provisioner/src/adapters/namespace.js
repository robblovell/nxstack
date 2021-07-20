"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NamespacedAdapterHelper = void 0;
const tslib_1 = require("tslib");
const inquirer = tslib_1.__importStar(require("inquirer"));
const contracts_1 = require("@provisioner/contracts");
class NamespacedAdapterHelper {
    constructor(adapter) {
        this.adapter = adapter;
        this.newNamespace = '** new namespace **';
        this.appNamespaceWhen = (answers) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const result = yield this.adapter.cluster.list({
                kind: 'Namespace',
                metadata: { labels: { 'app.kubernetes.io/managed-by': 'codezero' } }
            });
            if (result.hasItems) {
                this.appNamespaceChoices = result.object.items.map(ns => ns.metadata.name).filter(name => name !== 'c6o-system' && name !== 'istio-system');
                this.appNamespaceChoices.unshift({ name: 'New namespace', value: this.newNamespace }, new inquirer.Separator());
                return true;
            }
            answers.appNamespace = this.newNamespace;
            return false;
        });
        this.appNamespace = (options) => {
            var _a, _b;
            return ((_a = this.adapter.resource.metadata) === null || _a === void 0 ? void 0 : _a.namespace) ||
                ((_b = this.adapter.resource.spec.provisioner) === null || _b === void 0 ? void 0 : _b.namespace) ||
                (options === null || options === void 0 ? void 0 : options.namespace);
        };
    }
    inquireAppNamespace(options) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const answers = {
                appNamespace: this.appNamespace(options)
            };
            const responses = yield inquirer.prompt([{
                    type: 'list',
                    name: 'appNamespace',
                    message: 'Where would you like to install this?',
                    when: this.appNamespaceWhen,
                    choices: () => this.appNamespaceChoices
                }, {
                    type: 'input',
                    name: 'newNamespace',
                    message: 'New namespace for application? ',
                    when: (answers) => answers.appNamespace === this.newNamespace,
                    validate: (namespace) => /^([a-z0-9]([a-z0-9-]*[a-z0-9])?)$/.test(namespace) ?
                        true :
                        'Namespaces must consist of lowercase alphanumeric characters or \'-\', and must start and end with an alphanumeric character'
                }], answers);
            this.adapter.resource.metadata.namespace = responses.newNamespace || responses.appNamespace;
        });
    }
    validateAppNamespace() {
        if (!this.adapter.resource.metadata.namespace) {
            this.adapter.resource.metadata.namespace = this.appNamespace();
            if (!this.adapter.resource.metadata.namespace)
                throw new Error('Application namespace is required');
        }
    }
    ensureAppNamespace() {
        var _a, _b;
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (this.adapter.namespace)
                return;
            try {
                (_a = this.adapter.status) === null || _a === void 0 ? void 0 : _a.push('Ensure app namespace exists');
                this.adapter.namespace = yield this.ensureNamespace(this.adapter.resource.metadata.namespace);
            }
            finally {
                (_b = this.adapter.status) === null || _b === void 0 ? void 0 : _b.pop();
            }
        });
    }
    ensureNamespace(namespace) {
        var _a;
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (!namespace)
                return this.adapter.namespace;
            const namespaceResource = typeof namespace === 'string' ?
                contracts_1.NamespaceHelper
                    .from(namespace)
                    .setLabel(contracts_1.Labels.K8SAppManagedBy, contracts_1.Labels.valueManagedByC6O)
                    .resource :
                namespace;
            if (!namespaceResource)
                throw new Error('Unable to determine application namespace');
            const result = yield this.adapter.cluster.upsert(namespaceResource);
            result.throwIfError(`Failed to create namespace ${(_a = namespaceResource.metadata) === null || _a === void 0 ? void 0 : _a.name}`);
            return namespaceResource;
        });
    }
}
exports.NamespacedAdapterHelper = NamespacedAdapterHelper;
//# sourceMappingURL=namespace.js.map