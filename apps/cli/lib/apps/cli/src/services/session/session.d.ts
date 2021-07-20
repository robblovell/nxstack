import { ClusterSessionOptions, LockingSessionStorage, LocksLocationClass } from './storage/contracts';
import { Session as SessionContract } from '../contracts';
export interface SessionOptions {
    storageClass?: LocksLocationClass;
}
export declare class Session implements SessionContract {
    readonly signature: string;
    protected lockStorage?: LockingSessionStorage;
    static descriptionKey: string;
    config: {};
    protected _signatureHash: any;
    get signatureHash(): any;
    constructor(signature: string, lockStorage?: LockingSessionStorage);
    static subSessionList(options: ClusterSessionOptions): Promise<string[]>;
    static purge(options: ClusterSessionOptions): Promise<void>;
    setDescription: (value: any) => Promise<void>;
    dependantCount(): Promise<number>;
    protected ensureAlive(): void;
    lock(): Promise<boolean>;
    release(): Promise<void>;
    dispose(): Promise<void>;
    any(items: any[]): Promise<boolean>;
    set(key: string, value: any): Promise<void>;
    get<T>(key: string): Promise<T>;
    remove(key: string): Promise<void>;
}
