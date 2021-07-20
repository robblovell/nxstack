import { Performer, PerformerParams } from '../base';
export declare class AuthPerformer<T extends PerformerParams = PerformerParams> extends Performer<T> {
    get filepath(): string;
    getConfig(): Promise<any>;
    saveConfig(config: any): Promise<void>;
    setToken(token: any): Promise<void>;
    hasValidToken(): Promise<boolean>;
    getToken(): Promise<any>;
}
