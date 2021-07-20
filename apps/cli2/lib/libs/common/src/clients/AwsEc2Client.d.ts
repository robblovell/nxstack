export declare class AwsEc2Client {
    accessKeyId: any;
    secretAccessKey: any;
    apiVersion: string;
    isReady: boolean;
    apiURL: (regionCode?: string) => string;
    init(accessKeyId: any, secretAccessKey: any): Promise<void>;
    sendRequest: (action: string, regionCode?: string, params?: any) => Promise<import("axios").AxiosResponse<any>>;
    getSshKeyPairs: (regionCode: string) => Promise<any>;
    createSshKeyPair: (regionCode: string, name: string) => Promise<any>;
    getRegions: () => Promise<any>;
    getMachineTypes: (regionCode: string) => Promise<any[]>;
    getSubnets: (regionCode: string, vpcId: string) => Promise<any>;
    createSubnet: (regionCode: string, name: string) => Promise<any>;
    getVpcs: (regionCode: string) => Promise<any>;
    createVpc: (regionCode: string) => Promise<any>;
}
