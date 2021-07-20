import { EventEmitter } from 'events'
import { MessagePort } from 'worker_threads'
import { Status, Resource, itemType } from '@c6o/kubeclient-contracts'

export const statusFactory = (parentPort) => () => (manager: EventEmitter, resource: Resource) => new ServerStatus(parentPort, manager, resource)

export class ServerStatus extends Status {

    document
    constructor(private parentPort : MessagePort, private manager: EventEmitter, private resource: Resource) {
        super()

        this.manager.on('load', () => {
            this.document = {
                apiVersion: this.resource.apiVersion,
                kind: this.resource.kind,
                metadata: {
                    name: this.resource.metadata.name,
                    namespace: this.resource.metadata.namespace,
                    resourceVersion: this.resource.metadata.resourceVersion
                }
            }
        })
        this.manager.on('done', () => this.parentPort?.postMessage({document: this.resource, done: true}))
    }

    mutated(...items: itemType[]) {
        super.mutated()
        if (this.parentPort) {
            this.parentPort.postMessage({document: this.resource, items})
        }
    }
}
