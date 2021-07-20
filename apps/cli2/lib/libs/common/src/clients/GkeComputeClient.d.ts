import { BaseClient } from './BaseClient';
export declare class GkeComputeClient extends BaseClient {
    token: any;
    tokenPromise: any;
    get apiURL(): string;
    init(token?: any): Promise<void>;
    getMachineTypes: (projectId: string, zoneId: string, vmSeriesPrefix?: string) => Promise<any>;
}
