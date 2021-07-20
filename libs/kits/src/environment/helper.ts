import { Cluster, ResourceHelper, listOptions } from '@c6o/kubeclient-contracts'
import { Namespace } from '@c6o/kubeclient-resources/core/v1'

export type paging = Pick<listOptions, 'limit' | 'continue'>

export class EnvironmentHelper extends ResourceHelper<Namespace> {

    template = (name?: string) => ({
        apiVersion: 'v1',
        kind: 'Environment',
        metadata: {
            ...(name ? { name } : undefined),
            labels: {
                'system.codezero.io/type': 'environment'
            }
        }
    })

    async create(cluster: Cluster, name: string): Promise<Namespace> {
        const result = await cluster.create(this.template(name))
        result.throwIfError(`Failed to create Environment ${name}`)
        return result.as<Namespace>()
    }

    async delete(cluster: Cluster, name: string) {
        const result = await cluster.delete(this.template(name))
        result.throwIfError(`Failed to delete Environment ${name}`)
        return result.as<Namespace>()
    }

    async list(cluster: Cluster, page?: paging) {
        const result = await cluster.list(this.template(), page)
        result.throwIfError('Failed to retrieve Environments')
        return result.each('Namespace')
    }
}
