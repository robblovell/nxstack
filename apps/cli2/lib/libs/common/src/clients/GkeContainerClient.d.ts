import { BaseClient } from './BaseClient';
export declare class GkeContainerClient extends BaseClient {
    token: any;
    tokenPromise: any;
    get apiURL(): string;
    init(token?: any): Promise<void>;
    createCluster: (projectId: string, zoneId: string, spec: any) => Promise<any>;
    deleteCluster: (targetUrl: string) => Promise<import("axios").AxiosResponse<any>>;
    getClusters: (projectId: string, zoneId: string) => Promise<any>;
    getCluster: (targetUrl: string) => Promise<any>;
    waitForCluster: (targetUrl: string) => Promise<any>;
    getKubeOptions: (projectId: string, zoneId: string) => Promise<any>;
    getKubeConfig: (targetUrl: string) => Promise<{
        apiVersion: string;
        kind: string;
        clusters: {
            cluster: {
                'certificate-authority-data': string;
                server: string;
            };
            name: string;
        }[];
        contexts: {
            context: {
                cluster: string;
                user: string;
            };
            name: string;
        }[];
        'current-context': string;
        users: {
            name: string;
            user: {
                token: any;
            };
        }[];
    }>;
    getRecommendedZones: (projectId: string) => Promise<any>;
    private _generateKubecConfig;
}
