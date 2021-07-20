/// <reference types="node" />
import { ServerResponse } from 'http';
export declare class HTTPServer {
    server: any;
    callback: any;
    serverPromise: any;
    respond(res: ServerResponse, status: number, response: string): void;
    start(port: number, requestListener: any): Promise<unknown>;
    stop(): void;
}
