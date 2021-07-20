import { Cluster, ResourceHelper, listOptions } from '@c6o/kubeclient-contracts'
import { Namespace, NamespaceList } from '@c6o/kubeclient-resources/core/v1'

export type paging = Pick<listOptions, 'limit' | 'continue'>

export abstract class BaseNamespaceHelper extends ResourceHelper<Namespace> {

    abstract get type()
    abstract get typeDisplay()

    isType = (namespace: Namespace) =>
        namespace.metadata?.labels?.['system.codezero.io/type'] === this.type

    makeType = (namespace: Namespace) => {
        namespace.metadata.labels = {
            ...namespace.metadata.labels,
            'system.codezero.io/type': this.type
        }
        return namespace
    }

    template = (name?: string) => ({
        apiVersion: 'v1',
        kind: 'Namespace',
        metadata: {
            ...(name ? { name } : undefined),
            labels: {
                'system.codezero.io/type': this.type
            }
        }
    })

    async get(cluster: Cluster, name: string) {
        const result = await cluster.read(this.template(name))
        result.throwIfError(`Failed to retrieve ${this.typeDisplay} ${name}`)
        return result.as<Namespace>()
    }

    async list(cluster: Cluster, page?: paging) {
        const result = await cluster.list(this.template(), page)
        result.throwIfError(`Failed to retrieve ${this.typeDisplay}`)
        return result.each('Namespace')
    }

    async find(cluster: Cluster, page?: paging) {
        const result = await cluster.list(this.template(), page)
        result.throwIfError(`Failed to retrieve ${this.typeDisplay}`)
        return result.as<NamespaceList>()
    }

    async upsert(cluster: Cluster, name: string): Promise<Namespace> {
        const namespace = this.template(name)
        const result = await cluster.read(namespace)
        if (result.errorCode === '404')
            return this.create(cluster, name)

        const exitingNS = result.as<Namespace>()
        if (this.isType(exitingNS))
            return exitingNS

        const type = exitingNS.metadata?.labels?.['system.codezero.io/type']
        if (type !== undefined && type !== this.type)
            throw new Error(`Namespace ${name} is of type ${type} can can't be set to ${this.type}`)

        const patchResult = await cluster.patch(exitingNS, this.makeType(exitingNS))
        patchResult.throwIfError(`Failed to make Namespace ${exitingNS.metadata.name} an Environment`)
        return patchResult.as<Namespace>()
    }

    async create(cluster: Cluster, name: string): Promise<Namespace> {
        const result = await cluster.create(this.template(name))
        result.throwIfError(`Failed to create ${this.typeDisplay} ${name}`)
        return result.as<Namespace>()
    }

    async delete(cluster: Cluster, name: string) {
        const result = await cluster.delete(this.template(name))
        result.throwIfError(`Failed to delete ${this.typeDisplay} ${name}`)
        return result.as<Namespace>()
    }
}
