import { Cluster, keyValue, Processor, Result } from '@c6o/kubeclient-contracts';
import { Deployment, DeploymentList } from '@c6o/kubeclient-resources/apps/v1';
import { DeploymentHelper as DeploymentHelperContract } from '@provisioner/contracts';
export declare class DeploymentHelper<T extends Deployment = Deployment> extends DeploymentHelperContract<T> {
    resourceList: DeploymentList;
    static from: (namespace?: string, name?: string) => DeploymentHelper<Deployment>;
    restart(cluster: Cluster): Promise<Deployment>;
    static containers(deployments: Deployment[], section?: any): any[];
    static keyMapReferences(deployments: Deployment[]): any;
    static toKeyValues(deployments: Deployment[], merge?: keyValue): keyValue;
    toKeyValues(cluster: Cluster, merge?: keyValue | Promise<keyValue>): Promise<keyValue>;
    static ensurePodRunning(result: Result, processor: Processor, message?: string): Promise<void>;
}
