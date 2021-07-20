import { BaseClient } from './BaseClient';
export declare class StripeClient extends BaseClient {
    get apiURL(): string;
    init(token?: any): Promise<void>;
}
