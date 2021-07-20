export interface Cluster {
    name: string;
    caData?: string;
    caFile?: string;
    server: string;
    skipTLSVerify: boolean;
}
export declare function newClusters(a: any): Cluster[];
export declare function exportCluster(cluster: Cluster): any;
export interface User {
    name: string;
    certData?: string;
    certFile?: string;
    exec?: any;
    keyData?: string;
    keyFile?: string;
    authProvider?: any;
    token?: string;
    username?: string;
    password?: string;
}
export declare function newUsers(a: any): User[];
export declare function exportUser(user: User): any;
export interface Context {
    readonly cluster: string;
    readonly user: string;
    readonly name: string;
    readonly namespace?: string;
}
export declare function newContexts(a: any): Context[];
export declare function exportContext(ctx: Context): any;
