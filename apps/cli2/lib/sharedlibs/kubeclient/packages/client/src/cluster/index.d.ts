import { KubeConfig } from '@kubernetes/client-node';
import { Cluster as ClusterInterface, ClusterOptions, Status, Version } from '@c6o/kubeclient-contracts';
import { Request } from '../request';
import { Processor } from '../processor';
export declare type baseMixinType = new (...a: any[]) => Cluster;
export interface Cluster extends ClusterInterface {
}
declare const clusterBaseMixin: new (...a: any[]) => ClusterInterface;
export declare class Cluster extends clusterBaseMixin {
    options: ClusterOptions;
    processors: Array<Processor>;
    processor: Processor;
    info: Version;
    status: Status;
    constructor(options?: ClusterOptions);
    begin(stageName?: string): Processor;
    _kubeConfig: KubeConfig;
    get kubeConfig(): KubeConfig;
    _request: Request;
    get request(): Request;
}
export {};
