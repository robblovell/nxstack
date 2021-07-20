/// <reference types="node" />
import { attemptCallback } from '@c6o/kubeclient-contracts';
import { baseProcessorMixinType } from '../';
export declare const attemptMixin: (base: baseProcessorMixinType) => {
    new (...a: any[]): {
        attempt(times: number, sleepTime: number, callback: attemptCallback): any;
        cluster: import("../cluster").Cluster;
        stageName?: any;
        sleep: (ms: any) => Promise<unknown>;
        commands: import("@c6o/kubeclient-contracts").commandFn[];
        additions: import("@c6o/kubeclient-contracts").commandFn[];
        waitListPromises: Promise<any>[];
        ended: boolean;
        currentCommand: import("@c6o/kubeclient-contracts").commandFn;
        lastCommand: import("@c6o/kubeclient-contracts").commandFn;
        lastResult: import("@c6o/kubeclient-contracts").Result;
        waitList: (promise: Promise<any>) => number;
        ensureVersion(): Promise<void>;
        runWorker(): Promise<void>;
        do(cmd: import("@c6o/kubeclient-contracts").commandFn): any;
        end(): Promise<import("@c6o/kubeclient-contracts").Result>;
        copy(resource: import("@c6o/kubeclient-contracts").Resource, src: string, dst: string): any;
        owners: import("@c6o/kubeclient-contracts").Resource[];
        addOwner(object: import("@c6o/kubeclient-contracts").Resource): any;
        clearOwners(): any;
        mergeDocument: Partial<import("@c6o/kubeclient-contracts").Resource>;
        mergeWith(resource: Partial<import("@c6o/kubeclient-contracts").Resource>): any;
        clearMergeWith(): any;
        list(object: import("@c6o/kubeclient-contracts").Resource): any;
        read(object: import("@c6o/kubeclient-contracts").Resource): any;
        create(object: import("@c6o/kubeclient-contracts").Resource): any;
        patch(object: import("@c6o/kubeclient-contracts").Resource, patch: import("@c6o/kubeclient-contracts").PatchOps | import("@c6o/kubeclient-contracts").PartialDeep<import("@c6o/kubeclient-contracts").Resource>, options?: import("@c6o/kubeclient-contracts").PatchOptions): any;
        delete(object: import("@c6o/kubeclient-contracts").Resource): any;
        upsert(object: import("@c6o/kubeclient-contracts").Resource): any;
        exec(resource: import("@c6o/kubeclient-contracts").Resource, command: string | string[], stdout?: import("stream").Writable, stderr?: import("stream").Writable, stdin?: import("stream").Readable): any;
        eachFile(fn: any, file: string, params?: any): any;
        upsertFile(file: string, params?: any): any;
        createFile(file: string, params?: any): any;
        deleteFile(file: string, params?: any): any;
        if(condition: boolean, trueCallback: import("@c6o/kubeclient-contracts").ifCallback, falseCallback?: import("@c6o/kubeclient-contracts").ifCallback): any;
        beginForward(containerPort: number, resource: import("@c6o/kubeclient-contracts").Resource): any;
        endForward(): any;
        beginWatch(resource: import("@c6o/kubeclient-contracts").Resource): any;
        whenWatch(conditionFn: any, actionFn: any): any;
        endWatch(): any;
    };
};