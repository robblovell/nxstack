import { CodeZeroHelper } from "../codezero";
import { Deployment } from '@c6o/kubeclient-resources/apps/v1';
export declare class DeploymentHelper<T extends Deployment = Deployment> extends CodeZeroHelper<T> {
    static template: (namespace?: string, name?: string) => Deployment;
    static from: (namespace?: string, name?: string) => DeploymentHelper<Deployment>;
    static volumesPath(): string;
    static volumeMountsPath(): string;
    get templateSpec(): any;
    get appName(): any;
    get volumes(): any;
    get volumeMounts(): any;
    get volumesNotMounted(): any;
}
