import { Resource } from '@c6o/kubeclient-contracts';
import { WorkloadResource } from '@provisioner/common';
import { MonitorFactory } from '../base';
import { EnvMonitor } from './base';
export declare class WorkloadEnvMonitor extends EnvMonitor<WorkloadResource> {
    shallowEqual(object1: any, object2: any): boolean;
    protected onAdded(): Promise<boolean>;
    protected onModified(): Promise<boolean>;
    protected monitorFactory(resource: Resource): MonitorFactory;
}
