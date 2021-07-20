/// <reference types="config" />
import { IConfig } from '../';
declare global {
    interface Window {
        c6oEnv: any;
    }
}
export declare class WebConfig implements IConfig {
    get hubLoginURL(): any;
    get hubURL(): any;
    _apiURL: any;
    get apiURL(): any;
    get envVars(): any;
    init(config: any): void;
    get<T = string>(key: string): T;
    has: (key: string) => boolean;
    util: any;
}
