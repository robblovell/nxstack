export declare class AwsIamClient {
    accessKeyId: any;
    secretAccessKey: any;
    apiVersion: string;
    apiURL: () => string;
    init(accessKeyId: any, secretAccessKey: any): Promise<void>;
    sendRequest: (action: string, params?: any) => Promise<import("axios").AxiosResponse<any>>;
    getRoles: (roleType: 'ec2' | 'eks') => Promise<any>;
    createRole: (roleName: string, spec: any) => Promise<any>;
    getRoleAttachedPolicies: (roleName: string) => Promise<any>;
    attachRolePolicy: (roleName: string, policyArn: string) => Promise<any>;
    getCustomPolicies: () => Promise<any>;
    createPolicy: (policyName: string, spec: any) => Promise<any>;
    eksClusterInlinePolicy: () => {
        Version: string;
        Statement: {
            Effect: string;
            Principal: {
                Service: string;
            };
            Action: string;
        }[];
    };
    ec2NodeGroupInlinePolicy: () => {
        Version: string;
        Statement: {
            Effect: string;
            Principal: {
                Service: string;
            };
            Action: string;
        }[];
    };
    eksCustomPolicy: () => {
        Version: string;
        Statement: ({
            Effect: string;
            Action: string[];
            Resource: string;
            Condition?: undefined;
        } | {
            Effect: string;
            Action: string;
            Resource: string;
            Condition: {
                StringEquals: {
                    'iam:PassedToService': string;
                };
            };
        })[];
    };
    getCustomPolicy: () => Promise<any>;
    getClusterRole: () => Promise<any>;
    getNodeRole: () => Promise<any>;
}
