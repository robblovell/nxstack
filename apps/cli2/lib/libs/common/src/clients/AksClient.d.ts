import { BaseClient } from './BaseClient';
export declare class AksClient extends BaseClient {
    token: any;
    tokenPromise: any;
    isReady: boolean;
    get apiURL(): string;
    get resourceApiVersion(): string;
    get clusterApiVersion(): string;
    init(token?: any): Promise<void>;
    sleep(ms: any): Promise<unknown>;
    waitForReady: () => Promise<void>;
    refreshToken: (refresh: any, clientId: any, clientSecret: any) => Promise<void>;
    getSubscriptions: () => Promise<any>;
    getResourceGroups: (subscriptionId: string) => Promise<any>;
    getLocations: (subscriptionId: string) => Promise<any>;
    getMachineTypes: (subscriptionId: string, locationCode: string, vmSeriesPrefix?: string) => Promise<any>;
    createCluster: (subscriptionId: string, resourceGroupId: string, name: string, spec: any) => Promise<any>;
    deleteCluster: (targetUrl: string) => Promise<import("axios").AxiosResponse<any>>;
    getClusters: (subscriptionId: string, resourceGroupId: string) => Promise<any>;
    getCluster: (targetUrl: string) => Promise<any>;
    waitForCluster: (targetUrl: string) => Promise<any>;
    getKubeConfig: (targetUrl: string) => Promise<string>;
}
