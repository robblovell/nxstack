import { BaseClient } from './BaseClient';
export declare class NgrokClient extends BaseClient {
    get apiURL(): string;
    getTunnels(): Promise<any>;
    isReady(): Promise<boolean>;
    createTunnel(data: any): Promise<any>;
    deleteTunnel(name: any): Promise<any>;
}
