import { ConfigMap } from '@c6o/kubeclient-resources/core/v1';
import { EnvMonitor } from './base';
export declare class ConfigMapEnvMonitor extends EnvMonitor<ConfigMap> {
    protected onAdded(): Promise<boolean>;
    protected onModified(): Promise<boolean>;
}
