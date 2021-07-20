/// <reference types="node" />
import { Version, Result } from '@c6o/kubeclient-contracts';
import { baseMixinType } from './';
export declare const versionMixin: (base: baseMixinType) => {
    new (...a: any[]): {
        version(): Promise<Version>;
        processors: import("..").Processor[];
        processor: import("..").Processor;
        info: Version;
        status: import("@c6o/kubeclient-contracts").Status;
        options: import("@c6o/kubeclient-contracts").ClusterOptions;
        begin(stageName?: string): import("..").Processor;
        _kubeConfig: import("@kubernetes/client-node").KubeConfig;
        readonly kubeConfig: import("@kubernetes/client-node").KubeConfig;
        _request: import("..").Request;
        readonly request: import("..").Request;
        list(resource: import("@c6o/kubeclient-contracts").Resource, options?: import("@c6o/kubeclient-contracts").listOptions): Promise<Result>;
        read(resource: import("@c6o/kubeclient-contracts").Resource, options?: import("@c6o/kubeclient-contracts").readOptions): Promise<Result>;
        create<R extends import("@c6o/kubeclient-contracts").Resource = import("@c6o/kubeclient-contracts").Resource>(resource: R, owners?: import("@c6o/kubeclient-contracts").Resource[], options?: import("@c6o/kubeclient-contracts").createOptions): Promise<Result>;
        put<R_1 extends import("@c6o/kubeclient-contracts").Resource = import("@c6o/kubeclient-contracts").Resource>(resource: R_1, newDoc: R_1, params?: import("@c6o/kubeclient-contracts").putOptions): Promise<Result>;
        patch<R_2 extends import("@c6o/kubeclient-contracts").Resource = import("@c6o/kubeclient-contracts").Resource>(resource: R_2, patch: import("@c6o/kubeclient-contracts").PatchOps | import("@c6o/kubeclient-contracts").PartialDeep<R_2>): Promise<Result>;
        delete<R_3 extends import("@c6o/kubeclient-contracts").Resource = import("@c6o/kubeclient-contracts").Resource>(resource: R_3): Promise<Result>;
        upsert<R_4 extends import("@c6o/kubeclient-contracts").Resource = import("@c6o/kubeclient-contracts").Resource>(resource: R_4, owners?: import("@c6o/kubeclient-contracts").Resource[]): Promise<Result>;
        toAddress(resource: import("@c6o/kubeclient-contracts").Resource): Promise<import("@c6o/kubeclient-contracts").ResourceAddress>;
        toString(resource: import("@c6o/kubeclient-contracts").Resource): string;
        watch(resource: import("@c6o/kubeclient-contracts").Resource, callback: import("@c6o/kubeclient-contracts").watchCallback, error: import("@c6o/kubeclient-contracts").watchDone): Promise<Result>;
        exec(resource: import("@c6o/kubeclient-contracts").Resource, command: string | string[], stdout?: import("stream").Writable, stderr?: import("stream").Writable, stdin?: import("stream").Readable): Promise<Result>;
        logs(resource: import("@c6o/kubeclient-contracts").Resource, follow?: boolean): Promise<Result>;
        portForward(containerPort: number, resource: import("@c6o/kubeclient-contracts").Resource): Promise<Result>;
    };
};
