/// <reference types="node" />
import { Readable, Writable } from 'stream';
import { keyValue, Resource, ResourceAddress } from './resource';
import { Result } from './result';
import { Processor } from './processor';
import { Version } from './version';
import { watchCallback, watchDone } from './request';
import { Status } from './status';
import { PartialDeep } from './helpers';
export interface listOptions {
    table?: boolean;
    fieldSelector?: string;
    limit?: number;
    continue?: string;
}
export interface logOptions {
    impersonate?: string;
}
export interface readOptions {
    impersonate?: string;
}
export interface putOptions {
    subResource?: string;
}
export interface createOptions {
    impersonate?: string;
}
export declare type Op = 'replace' | 'add' | 'remove' | 'test' | 'copy' | 'move';
export interface PatchOp {
    op: Op;
    path: string;
    value?: any;
}
export declare type PatchOps = Array<PatchOp>;
export interface PatchOptions {
    headers?: keyValue;
}
export interface Watcher {
    disposer: () => void;
}
export interface Cluster {
    begin(stageName?: string): Processor;
    processor: Processor;
    status?: Status;
    info: Version;
    list(resource: Resource, options?: listOptions): Promise<Result>;
    read(resource: Resource, options?: readOptions): Promise<Result>;
    create<R extends Resource = Resource>(resource: R, owners?: Array<Resource>, options?: createOptions): Promise<Result>;
    put<R extends Resource = Resource>(resource: R, newDoc: R, params?: putOptions): Promise<Result>;
    patch<R extends Resource = Resource>(resource: R, patch: PartialDeep<R> | PatchOps): Promise<Result>;
    delete<R extends Resource = Resource>(resource: R): Promise<Result>;
    upsert<R extends Resource = Resource>(resource: R, owners?: Array<Resource>): Promise<Result>;
    toAddress(resource: Resource): Promise<ResourceAddress>;
    toString(resource: Resource): string;
    watch(resource: Resource, callback: watchCallback, error: watchDone): Promise<Result>;
    exec(resource: Resource, command: string | string[], stdout?: Writable, stderr?: Writable, stdin?: Readable): Promise<Result>;
    logs(resource: Resource, follow?: boolean): Promise<Result>;
    portForward(containerPort: number, resource: Resource): Promise<Result>;
    version(): Promise<Version>;
}
