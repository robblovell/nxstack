export declare class AwsEksClient {
    accessKeyId: any;
    secretAccessKey: any;
    sessionToken: any;
    isReady: boolean;
    apiURL: (regionCode: string) => string;
    init(accessKeyId: any, secretAccessKey: any): Promise<void>;
    createCluster: (spec: any, regionCode: string) => Promise<import("axios").AxiosResponse<any>>;
    createNodeGroup: (clusterName: string, spec: any, regionCode: string) => Promise<import("axios").AxiosResponse<any>>;
    deleteCluster: (name: string, regionCode: string) => Promise<import("axios").AxiosResponse<any>>;
    getClusters: (regionCode: string) => Promise<import("axios").AxiosResponse<any>>;
    getCluster: (name: string, regionCode: string) => Promise<import("axios").AxiosResponse<any>>;
    getNodeGroups: (clusterName: string, regionCode: string) => Promise<import("axios").AxiosResponse<any>>;
    getNodeGroup: (clusterName: string, name: string, regionCode: string) => Promise<import("axios").AxiosResponse<any>>;
    waitForCluster: (name: string) => Promise<never>;
    private kubeConfigTemplate;
    getKubeConfig: (clusterName: string, clusterEndpoint: string, clusterCertificate: string, regionCode: string) => Promise<any>;
    generateUserToken: (regionCode: string, clusterName: any, expires?: string, formatTime?: any) => Promise<string>;
}
