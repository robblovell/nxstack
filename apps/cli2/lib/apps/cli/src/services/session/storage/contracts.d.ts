import { SessionDescription } from '../composite';
import { Cluster } from '@c6o/kubeclient-contracts';
export interface ClusterSessionOptions {
    cluster?: Cluster;
    namespace: string;
}
export interface LocksLocationClass {
    readonly locksLocation: string;
    new (keySignature: string, options?: any): LockingSessionStorage;
    list: (descriptionKey: string, options?: ClusterSessionOptions) => Promise<SessionDescription[] | string[]>;
    subSessionList: (descriptionKey: string, options?: ClusterSessionOptions) => Promise<string[]>;
    purge: (options?: ClusterSessionOptions) => Promise<void>;
}
export interface LockingSessionStorage {
    save(data: any, signature?: string): Promise<void>;
    load(signature?: string): Promise<any>;
    ensure(data: any): Promise<boolean>;
    lock(): Promise<void>;
    release(): Promise<void>;
    dispose(): Promise<void>;
    disposed(): boolean;
}
