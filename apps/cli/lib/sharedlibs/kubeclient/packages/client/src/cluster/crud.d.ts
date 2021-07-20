/// <reference types="node" />
import { Resource, Result, PatchOps, PartialDeep, readOptions, listOptions, createOptions, putOptions, PatchOptions } from '@c6o/kubeclient-contracts';
import { baseMixinType } from './';
export declare const crudMixin: (base: baseMixinType) => {
    new (...a: any[]): {
        list(document: Resource, options?: listOptions): Promise<Result>;
        read(document: Resource, options?: readOptions): Promise<Result>;
        create<R extends Resource = Resource>(document: R, owners?: Array<Resource>, options?: createOptions): Promise<Result>;
        put<R_1 extends Resource = Resource>(document: R_1, newDoc: R_1, params?: putOptions): Promise<Result>;
        patch<R_2 extends Resource = Resource>(document: R_2, patch: PatchOps | PartialDeep<R_2>, options?: PatchOptions): Promise<Result>;
        delete<R_3 extends Resource = Resource>(document: R_3): Promise<Result>;
        upsert<R_4 extends Resource = Resource>(document: R_4, owners?: Array<Resource>): Promise<Result>;
        processors: import("..").Processor[];
        processor: import("..").Processor;
        info: import("@c6o/kubeclient-contracts").Version;
        status: import("@c6o/kubeclient-contracts").Status;
        options: import("@c6o/kubeclient-contracts").ClusterOptions;
        begin(stageName?: string): import("..").Processor;
        _kubeConfig: import("@kubernetes/client-node").KubeConfig;
        readonly kubeConfig: import("@kubernetes/client-node").KubeConfig;
        _request: import("..").Request;
        readonly request: import("..").Request;
        toAddress(resource: Resource): Promise<import("@c6o/kubeclient-contracts").ResourceAddress>;
        toString(resource: Resource): string;
        watch(resource: Resource, callback: import("@c6o/kubeclient-contracts").watchCallback, error: import("@c6o/kubeclient-contracts").watchDone): Promise<Result>;
        exec(resource: Resource, command: string | string[], stdout?: import("stream").Writable, stderr?: import("stream").Writable, stdin?: import("stream").Readable): Promise<Result>;
        logs(resource: Resource, follow?: boolean): Promise<Result>;
        portForward(containerPort: number, resource: Resource): Promise<Result>;
        version(): Promise<import("@c6o/kubeclient-contracts").Version>;
    };
};
