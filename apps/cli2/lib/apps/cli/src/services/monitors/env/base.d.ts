import { keyValue, Resource } from '@c6o/kubeclient-contracts';
import { Monitor } from '../base';
import { EnvMonitorParams } from './params';
export declare class EnvMonitor<R extends Resource> extends Monitor<R, EnvMonitorParams> {
    envValues: keyValue;
    refresh(): Promise<void>;
    formatEnvContent(data: any): Promise<string>;
    stop(): Promise<void>;
}
