import { BaseClient } from './BaseClient';
export declare type permissionType = 'a' | 'w' | 'r';
export declare type typeType = 'apps' | 'clusters' | 'account' | 'editions';
export declare class HubClient extends BaseClient {
    get apiURL(): string;
    init(token?: any, privateKey?: any, jwkId?: any): Promise<void>;
    getMe(): Promise<any>;
    getApps(): Promise<any>;
    createApp(app: any): Promise<any>;
    getClusters(): Promise<any>;
    getCluster(id: any, params?: any): Promise<any>;
    createCluster(data: any): Promise<any>;
    patchCluster(id: any, data: any): Promise<any>;
    getClusterCredentials(id: any, createIfNone?: boolean): Promise<any>;
    getApp(namespace: any, showPublic?: boolean): Promise<any>;
    getAccounts(filters?: any): Promise<any>;
    getEditions(appId: any): Promise<any>;
    getAppManifest(appId: any, name: any): Promise<any>;
    getAppEditionManifest(appNamespace: any, edition: any): Promise<any>;
    createEdition(edition: any): Promise<any>;
    grant(type: typeType, id: any, perm: permissionType, personId?: any, orgId?: any, name?: any): Promise<any>;
    getPermissions(type: typeType, id: any): Promise<any>;
    transferOwnershipTo(type: typeType, id: string, toAccountId: string): Promise<any>;
    getStatus(): Promise<any>;
    upsertFromManifest(manifest: any): Promise<any>;
}
