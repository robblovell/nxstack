import { SessionDescription } from '../composite'
import { Cluster } from '@c6o/kubeclient-contracts'

export interface ClusterSessionOptions {
    cluster?: Cluster
    namespace: string
}

// This is needed for static methods on LockingSessionStorage
export interface LocksLocationClass {
    readonly locksLocation: string

    // TODO: make the second parameter a more general interface than ClusterInterface to encompass file systems and other types.
    new(keySignature: string, options?: any): LockingSessionStorage

    list: (descriptionKey: string, options?: ClusterSessionOptions) =>
        Promise<SessionDescription[] | string[]>
    subSessionList: (descriptionKey: string, options?: ClusterSessionOptions) =>
        Promise<string[]>
    purge: (options?: ClusterSessionOptions) => Promise<void>
}

export interface LockingSessionStorage {
    save(data: any, signature?: string): Promise<void>
    load(signature?: string): Promise<any>

    ensure(data: any): Promise<boolean>

    lock(): Promise<void>
    release(): Promise<void>
    dispose(): Promise<void>
    disposed(): boolean
}
