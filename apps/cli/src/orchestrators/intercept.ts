import { createDebug } from '@c6o/logger'
import { ServiceHelper, NamespaceHelper } from '@provisioner/contracts'
import { InterceptorParams, Interceptor } from '../services'
import { Questions } from '../ui'
import { Orchestrator } from './base'
import { Kubernetes, KubernetesResources } from './kubernetes'
import { SessionOrchestrator } from './session'

const debug = createDebug()
export class Intercept extends Orchestrator<InterceptorParams> {

    filteredNamespaces = ['c6o-seed', 'c6o-system', 'istio-system', 'kube-node-lease', 'kube-public', 'kube-system']

    async apply() {
        this.params = await this.UI.prompt(
                // ensure we have a cluster
                await Kubernetes.ensureCluster(this.params),
                // ensure we have a namespace
                await KubernetesResources.ensureResourceId(
                    this.params,
                    NamespaceHelper.template,
                    'namespace',
                    'namespaceResourceId',
                    'namespace',
                    n => !this.filteredNamespaces.includes(n.metadata.name)
                ),
                // identify the service
                await KubernetesResources.ensureResourceId(
                    this.params,
                    ServiceHelper.template,
                    'remoteService',
                    'remoteServiceResourceId',
                    'namespaceResourceId'),
                // identify service port as some services have more than one port
                await Intercept.ensureServicePort(this.params)
            )

        // TODO: temporary settings until we set this properly
        this.params.namespace = this.params.namespaceResourceId.metadata.name
        this.params.remoteService = this.params.remoteServiceResourceId.metadata.name
        debug('pre-flight params %o', this.params)

        // Perform the interception
        const service = new Interceptor(this.params)
        await service.perform('Intercept')
    }

    /**
     * Ensures that there is a cluster for upstream operations
     * @param params
     * @returns Does not have any prompts so always returns undefined
     */
    static async ensureServicePort(params): Promise<Questions<InterceptorParams>> {
        return [{
            type: 'list',
            message: 'Select one of the following service ports',
            name: 'remotePort',
            when: async (answers) => {
                const result = await params.cluster.read(answers.remoteServiceResourceId)
                result.throwIfError()
                if (result.object.spec.ports.length === 1)
                    answers.remotePort = result.object.spec.ports[0].port
                return result.object.spec.ports.length > 1
            },
            choices: async (answers) => {
                const result = await params.cluster.read(answers.remoteServiceResourceId)
                return result.object.spec.ports.map(
                    port => ({
                        name: port.port, // label
                        value: port.port
                    })
            )},
            default: async (answers) => {
                const result = await params.cluster.read(answers.remoteServiceResourceId)
                return result.object.spec.ports[0].port
            }
        }]
    }
}