import { Logger } from '@c6o/logger';
export declare class FeatureFlagStore {
    config: any;
    protected logger: Logger;
    storage: any;
    private _factory;
    private _client;
    private _trackingId;
    private _anonymousUserIdKey;
    initialized: boolean;
    init(): void;
    getAnonymousUser(): any;
    setUser(userId?: string): Promise<unknown>;
    flag(name: string, value?: string, attributes?: any): boolean;
}
