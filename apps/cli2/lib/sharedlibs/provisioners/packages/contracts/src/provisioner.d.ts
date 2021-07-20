import { Cluster, Status } from '@c6o/kubeclient-contracts';
import { AppResource } from './app';
import { Resolver } from './resolver';
export interface IngressParameters {
    ip?: string;
    hostname?: string;
}
export interface Controller {
    readonly status?: Status;
    readonly cluster: Cluster;
    readonly resolver: Resolver;
    readonly resource?: AppResource;
    readonly hubClient?: any;
}
export interface ProvisionerBase {
    controller: Controller;
    spec?: any;
    serviceNamespace: string;
    serviceName: string;
    getIngressGatewayServiceClusterIp(): Promise<string>;
    readFile(...args: string[]): Promise<string>;
    providedDeprovisionOption(option: any, answers?: any): any;
    getDeprovisionOption(option: any, defaultValue: any, answers?: any): any;
    setDeprovisionOption(option: any, value: any): any;
}
