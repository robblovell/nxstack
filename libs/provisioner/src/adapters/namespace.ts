// We have esModuleInterop false for live-plugin-manager and have to use import * from inquirer
import * as inquirer from 'inquirer'
import { Namespace } from '@c6o/kubeclient-resources/core/v1'
import { Labels, NamespaceHelper } from '@provisioner/contracts'
import { Resource, Result } from '@c6o/kubeclient-contracts'
import { NamespacedAdapter } from './contracts'

export class NamespacedAdapterHelper<R extends Resource> {

    constructor(private adapter: NamespacedAdapter<R>) { }

    newNamespace = '** new namespace **'
    appNamespaceChoices
    appNamespaceWhen = async (answers) => {
        const result: Result = await this.adapter.cluster.list({
            kind: 'Namespace',
            metadata: { labels: { 'app.kubernetes.io/managed-by': 'codezero' } }
        })
        if (result.hasItems) {
            this.appNamespaceChoices = result.object.items.map(ns => ns.metadata.name).filter(name => name !== 'c6o-system' && name !== 'istio-system')
            this.appNamespaceChoices.unshift({ name: 'New namespace', value: this.newNamespace }, new inquirer.Separator())
            return true
        }

        answers.appNamespace = this.newNamespace
        return false
    }

    appNamespace = (options?) => this.adapter.resource.metadata?.namespace ||
        this.adapter.resource.spec.provisioner?.namespace ||
        options?.namespace

    async inquireAppNamespace(options) {
        const answers = {
            appNamespace: this.appNamespace(options)
        }

        const responses = await inquirer.prompt([{
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
            validate: (namespace) =>
                /^([a-z0-9]([a-z0-9-]*[a-z0-9])?)$/.test(namespace) ?
                    true :
                    'Namespaces must consist of lowercase alphanumeric characters or \'-\', and must start and end with an alphanumeric character'
        }], answers)

        this.adapter.resource.metadata.namespace = responses.newNamespace || responses.appNamespace
    }

    validateAppNamespace() {
        // Inquire may not get called so we have to ensure
        // that namespace is set properly
        if (!this.adapter.resource.metadata.namespace) {
            this.adapter.resource.metadata.namespace = this.appNamespace()
            if (!this.adapter.resource.metadata.namespace)
                throw new Error('Application namespace is required')
        }
    }

    async ensureAppNamespace() {
        if (this.adapter.namespace)
            return

        try {
            this.adapter.status?.push('Ensure app namespace exists')
            this.adapter.namespace = await this.ensureNamespace(this.adapter.resource.metadata.namespace)
        }
        finally {
            this.adapter.status?.pop()
        }
    }

    /**
     * Ensures the namespace exists. If no namespace is provided, returns the document namespace
     * @param namespace
     * @returns Namespace resource
     */
    async ensureNamespace(namespace: string | Namespace) {
        if (!namespace)
            return this.adapter.namespace

        const namespaceResource = typeof namespace === 'string' ?
            NamespaceHelper
                .from(namespace)
                .setLabel(Labels.K8SAppManagedBy, Labels.valueManagedByC6O)
                .resource :
            namespace

        // The following should never happen if inquireAppNamespace is called first
        if (!namespaceResource)
            throw new Error('Unable to determine application namespace')

        const result = await this.adapter.cluster.upsert(namespaceResource)
        result.throwIfError(`Failed to create namespace ${namespaceResource.metadata?.name}`)
        return namespaceResource
    }
}
