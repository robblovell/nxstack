export declare class MemoryStorage {
    private storage;
    key: (n: any) => string;
    getItem: <T>(key: any) => T;
    setItem: <T>(key: string, value: T) => T;
    removeItem: (key: string) => boolean;
    clear: () => void;
}
