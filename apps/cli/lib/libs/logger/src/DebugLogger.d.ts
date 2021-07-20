import { Logger } from './Logger';
export declare class DebugLogger implements Logger {
    private _debug;
    init(path: any): void;
    debug: (...args: any[]) => any;
    info: (...args: any[]) => any;
    warn: (...args: any[]) => any;
    error: (...args: any[]) => any;
}
