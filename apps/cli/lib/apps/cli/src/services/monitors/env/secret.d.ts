import { Secret } from '@c6o/kubeclient-resources/core/v1';
import { EnvMonitor } from './base';
export declare class SecretEnvMonitor extends EnvMonitor<Secret> {
    protected onAdded(): Promise<boolean>;
    protected onModified(): Promise<boolean>;
}
