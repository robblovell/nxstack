/// <reference types="node" />
import { Resource, Result } from '@c6o/kubeclient-contracts';
import { baseMixinType } from './';
export declare const logsMixin: (base: baseMixinType) => {
    new (...a: any[]): {
        logs(document: Resource, follow?: boolean): Promise<Result>;
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
        list(resource: Resource, options?: import("@c6o/kubeclient-contracts").listOptions): Promise<Result>;
        read(resource: Resource, options?: import("@c6o/kubeclient-contracts").readOptions): Promise<Result>;
        create<R extends Resource = Resource>(resource: R, owners?: Resource[], options?: import("@c6o/kubeclient-contracts").createOptions): Promise<Result>;
        put<R_1 extends Resource = Resource>(resource: R_1, newDoc: R_1, params?: import("@c6o/kubeclient-contracts").putOptions): Promise<Result>;
        patch<R_2 extends Resource = Resource>(resource: R_2, patch: import("@c6o/kubeclient-contracts").PatchOps | import("@c6o/kubeclient-contracts").PartialDeep<R_2>): Promise<Result>;
        delete<R_3 extends Resource = Resource>(resource: R_3): Promise<Result>;
        upsert<R_4 extends Resource = Resource>(resource: R_4, owners?: Resource[]): Promise<Result>;
        toAddress(resource: Resource): Promise<import("@c6o/kubeclient-contracts").ResourceAddress>;
        toString(resource: Resource): string;
        watch(resource: Resource, callback: import("@c6o/kubeclient-contracts").watchCallback, error: import("@c6o/kubeclient-contracts").watchDone): Promise<Result>;
        exec(resource: Resource, command: string | string[], stdout?: import("stream").Writable, stderr?: import("stream").Writable, stdin?: import("stream").Readable): Promise<Result>;
        portForward(containerPort: number, resource: Resource): Promise<Result>;
        version(): Promise<import("@c6o/kubeclient-contracts").Version>;
    };
};
