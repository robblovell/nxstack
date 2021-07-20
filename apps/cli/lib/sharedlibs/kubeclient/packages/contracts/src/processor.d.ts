/// <reference types="node" />
import { Readable, Writable } from 'stream';
import { Cluster, PatchOps, PatchOptions } from './cluster';
import { Result } from './result';
import { Resource } from './resource';
import { attemptCallback } from './attempt';
import { ifCallback } from './if';
import { PartialDeep } from './helpers';
export declare type commandFn = (result?: Result, processor?: Processor) => Result | Promise<Result> | void | Promise<void>;
export interface Processor {
    cluster: Cluster;
    do(cmd: commandFn): this;
    end(): Promise<Result>;
    attempt(times: number, sleepTime: number, fn: attemptCallback): this;
    copy(resource: Resource, src: string, dst: string): this;
    owners: Array<Resource>;
    addOwner(object: Resource): this;
    clearOwners(): this;
    mergeDocument: Partial<Resource>;
    mergeWith(resource: Partial<Resource>): this;
    clearMergeWith(): this;
    list(object: Resource): this;
    read(object: Resource): this;
    create(object: Resource): this;
    patch(object: Resource, patch: PartialDeep<Resource> | PatchOps, options?: PatchOptions): this;
    delete(object: Resource): this;
    upsert(object: Resource): this;
    exec(resource: Resource, command: string | string[], stdout?: Writable, stderr?: Writable, stdin?: Readable): this;
    eachFile(fn: any, file: string, params?: any): this;
    upsertFile(file: string, params?: any): this;
    createFile(file: string, params?: any): this;
    deleteFile(file: string, params?: any): this;
    if(condition: boolean, trueCallback: ifCallback, falseCallback?: ifCallback): this;
    beginForward(containerPort: number, resource: Resource): this;
    endForward(): this;
    beginWatch(resource: Resource): this;
    whenWatch(conditionFn: any, actionFn: any): this;
    endWatch(): any;
}
