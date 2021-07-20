import { Resource, toResourceId } from '@c6o/kubeclient-contracts'
import { KubernetesParams } from '../../services'
import { KubernetesResourcesUI, Questions } from '../../ui'

export class KubernetesResources {

    /**
     * Given params, ensure that we are able to resolve a specific resource Id
     * @param params
     * @param nameProp
     * @param namespaceProp
     * @param resourceIdProp
     * @returns prompts
     */
    static async ensureResourceId<P extends KubernetesParams, K extends keyof P = keyof P> (
        params: P,
        helperFrom: (namespace?, name?) => Resource,
        nameProp: K,
        resourceIdProp?: K,
        namespaceOrNamespaceIdProp: K = 'namespace' as K,
        filter: (r: Resource) => boolean = null): Promise<Questions<P>> {

        // We already know the resourceId - nothing to do here
        if (params[resourceIdProp]) return

        // Read the resourceId from the cluster
        const namespaceName = KubernetesResourcesUI.toNamespaceName(params[namespaceOrNamespaceIdProp])
        const name = params[nameProp]

        const resourceId = helperFrom(namespaceName, name)

        // Do not check namespace as we may be dealing with a cluster resource
        if (name) {
            const result = await params.cluster.read(resourceId)
            result.throwIfError()
            params[resourceIdProp] = toResourceId(result.object) as unknown as P[K]
        } else {
            // We don't have a specific resource but either have a namespace
            // Or are dealing with a clustered resource
            return KubernetesResourcesUI.ensureResourceIdPrompts<P>(helperFrom, params, namespaceOrNamespaceIdProp, resourceIdProp, filter)
        }
    }
}
