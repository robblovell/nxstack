/// <reference types="node" />
import { Status } from '@c6o/kubeclient-contracts';
import { EventEmitter } from 'events';
export declare const projectBaseDir: string;
export interface ServiceParams {
    status?: Status;
}
export declare class Service<P extends ServiceParams> extends EventEmitter {
    params: P;
    protected status: Status;
    constructor(params: P);
    wrapStatus<T>(message: string, promiseOrFb: Promise<T> | (() => Promise<T>)): Promise<T>;
}
