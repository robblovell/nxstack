/// <reference types="node" />
import * as https from 'https';
import * as request from 'request';
import { Cluster, Context, User } from './types';
export declare class Config {
    static SERVICEACCOUNT_ROOT: string;
    static SERVICEACCOUNT_CA_PATH: string;
    static SERVICEACCOUNT_TOKEN_PATH: string;
}
export declare class KubeConfig {
    private static authenticators;
    clusters: Cluster[];
    users: User[];
    contexts: Context[];
    currentContext: string;
    constructor();
    getContexts(): Context[];
    getClusters(): Cluster[];
    getUsers(): User[];
    getCurrentContext(): string;
    setCurrentContext(context: string): void;
    getContextObject(name: string): Context;
    getCurrentCluster(): Cluster | null;
    getCluster(name: string): Cluster | null;
    getCurrentUser(): User | null;
    getUser(name: string): User | null;
    loadFromFile(file: string): void;
    applytoHTTPSOptions(opts: https.RequestOptions): Promise<void>;
    applyToRequest(opts: request.Options): Promise<void>;
    loadFromString(config: string): void;
    loadFromOptions(options: any): void;
    loadFromClusterAndUser(cluster: Cluster, user: User): void;
    loadFromCluster(pathPrefix?: string): void;
    mergeConfig(config: KubeConfig): void;
    addCluster(cluster: Cluster): void;
    addUser(user: User): void;
    addContext(ctx: Context): void;
    loadFromDefault(): void;
    makePathsAbsolute(rootDirectory: string): void;
    exportConfig(): string;
    private getCurrentContextObject;
    private applyHTTPSOptions;
    private applyAuthorizationHeader;
    private applyOptions;
}
