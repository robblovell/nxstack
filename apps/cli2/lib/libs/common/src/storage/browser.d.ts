export declare class BrowserStorage {
    key: (n: any) => string;
    getItem: <T>(key: any) => T;
    setItem: <T>(key: string, value: T) => any;
    removeItem: (key: string) => any;
    clear: () => any;
}
