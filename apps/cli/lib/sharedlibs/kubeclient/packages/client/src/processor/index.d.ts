import { Cluster } from '../cluster';
import { Processor as ProcessorInterface, Result, commandFn } from '@c6o/kubeclient-contracts';
export declare type baseProcessorMixinType = new (...a: any[]) => Processor;
declare const processorMixin: new (...a: any[]) => ProcessorInterface;
export declare class Processor extends processorMixin {
    cluster: Cluster;
    stageName?: any;
    constructor(cluster: Cluster, stageName?: any);
    sleep: (ms: any) => Promise<unknown>;
    commands: Array<commandFn>;
    additions: Array<commandFn>;
    waitListPromises: Array<Promise<any>>;
    ended: boolean;
    currentCommand: commandFn;
    lastCommand: commandFn;
    lastResult: Result;
    waitList: (promise: Promise<any>) => number;
    ensureVersion(): Promise<void>;
    runWorker(): Promise<void>;
    do(cmd: commandFn): this;
    end(): Promise<Result>;
}
export {};
