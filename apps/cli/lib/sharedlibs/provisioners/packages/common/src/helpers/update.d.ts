import { Cluster, Resource } from '@c6o/kubeclient-contracts';
export declare const updateImageTag: (cluster: Cluster, document: Resource, tag: string, path: string) => Promise<void>;
