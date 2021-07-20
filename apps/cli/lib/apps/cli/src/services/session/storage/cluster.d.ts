import { ClusterSessionOptions, LockingSessionStorage } from './contracts';
import { SessionResource } from './helper';
export declare class ClusterSessionStorage implements LockingSessionStorage {
    private keySignature;
    private _disposed;
    private cluster;
    private namespace;
    static get locksLocation(): string;
    private sessionHelper;
    constructor(keySignature: any, options: ClusterSessionOptions);
    disposed(): boolean;
    private ensureContainer;
    save(data: string): Promise<void>;
    create(data: string): Promise<void>;
    load(): Promise<any>;
    static list(options: ClusterSessionOptions): Promise<SessionResource[]>;
    static subSessionList(options: ClusterSessionOptions): Promise<string[]>;
    static purge(options: ClusterSessionOptions): Promise<void>;
    ensure(data: string): Promise<boolean>;
    lock(): Promise<void>;
    release(): Promise<void>;
    dispose(): Promise<void>;
}
