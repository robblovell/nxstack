import { BaseClient } from './BaseClient';
export declare class DigitalOceanClient extends BaseClient {
    token: any;
    tokenPromise: any;
    get apiURL(): string;
    init(token?: any): Promise<void>;
    createCluster: (spec: any) => Promise<any>;
    deleteCluster: (id: any) => Promise<import("axios").AxiosResponse<any>>;
    getClusters: () => Promise<any>;
    getCluster: (clusterId: string) => Promise<any>;
    waitForCluster: (clusterId: any) => Promise<any>;
    getKubeOptions: () => Promise<any>;
    getKubeConfig: (clusterId: string) => Promise<any>;
    getAccount: () => Promise<any>;
    getBalance: () => Promise<any>;
}
