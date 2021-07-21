import { ResourceHelper, Resource, toResourceId } from '@c6o/kubeclient-contracts'
import { KubernetesParams } from '../../services'
import { TerminalUI } from '../base'
import { TerminalUIParams } from '../params'
import { Questions } from '../contracts'
import { Namespace } from '@c6o/kubeclient-resources/core/v1'

const isNamespace = (ns: string | Namespace): ns is Namespace  => {
    return !!(ns as Namespace)?.kind
}

export class KubernetesResourcesUI<P extends TerminalUIParams> extends TerminalUI<P> {

    static toNamespaceName = (ns: string | Namespace) => isNamespace(ns) ?
            ns.metadata?.name :
            ns

    static async ensureResourceIdPrompts<P extends KubernetesParams, K extends keyof P = keyof P>
    (
        helperFrom: (namespace?) => Resource,
        params: P,
        namespaceOrNamespaceIdProp: K = 'namespace' as K,
        resourceIdProp?: K,
        filter: (r: Resource) => boolean = null
    ): Promise<Questions<P>> {
        let resources = null

        return [{
            type: 'list',
            message: 'Please select one of the following',
            name: resourceIdProp as string,
            when: async (answers) => {
                // We already know the  resourceId - nothing to do here
                if (params[resourceIdProp])
                    return false

                const namespace = answers[namespaceOrNamespaceIdProp] as (string | Namespace)
                const namespaceName = this.toNamespaceName(namespace)
                const resourceId = helperFrom(namespaceName)

                const result = await params.cluster.list(resourceId)
                result.throwIfError()

                const helper = new ResourceHelper(result.object)
                resources = filter ?
                    Array.from(helper.each(resourceId.kind)).filter(filter) :
                    Array.from(helper.each(resourceId.kind))

                if (resources.length === 1)
                    answers[resourceIdProp] = toResourceId(resources[0]) as unknown as P[K]
                return resources.length > 1
            },
            choices: () => resources.map(
                resource => ({
                    name: resource.metadata?.name, // What's displayed
                    value: toResourceId(resource) // The value
                })
            ),
            default: 0
        }]
    }
}