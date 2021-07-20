export declare class StatusStore {
    config: any;
    status: any;
    get initialized(): boolean;
    fetch(path: string): Promise<void>;
}
