import { BaseClient } from './BaseClient';
export declare class GkeResourceClient extends BaseClient {
    token: any;
    tokenPromise: any;
    get apiURL(): string;
    init(token?: any): Promise<void>;
    getProjects: () => Promise<any>;
    hasPermissions: (projectId: string, permissions: string[]) => Promise<boolean>;
}
