/// <reference types="node" />
import { EventEmitter } from 'events';
import { MessagePort } from 'worker_threads';
import { Status, Resource, itemType } from '@c6o/kubeclient-contracts';
export declare const statusFactory: (parentPort: any) => () => (manager: EventEmitter, resource: Resource) => ServerStatus;
export declare class ServerStatus extends Status {
    private parentPort;
    private manager;
    private resource;
    document: any;
    constructor(parentPort: MessagePort, manager: EventEmitter, resource: Resource);
    mutated(...items: itemType[]): void;
}
