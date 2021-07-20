import { LockingSessionStorage } from './contracts';
import { SessionDescription } from '../composite';
export declare class FileSessionStorage implements LockingSessionStorage {
    private keySignature;
    private lockRelease;
    _disposed: boolean;
    static get locksLocation(): string;
    private get configFile();
    constructor(keySignature: string);
    disposed(): boolean;
    private exists;
    save(data: string): Promise<void>;
    create(data: string): Promise<void>;
    load(): Promise<any>;
    static containerQuery(): string;
    list: typeof FileSessionStorage.list;
    static list(): Promise<SessionDescription[]>;
    static subSessionList(): Promise<string[]>;
    static purge(): Promise<void>;
    private static ensureLocksDir;
    ensure(data?: string): Promise<boolean>;
    lock(): Promise<void>;
    release(): Promise<void>;
    dispose(): Promise<void>;
}
