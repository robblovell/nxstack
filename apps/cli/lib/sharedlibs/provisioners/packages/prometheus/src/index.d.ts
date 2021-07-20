import { ProvisionerBase } from '@provisioner/common';
import { PrometheusProvisioner } from './contracts';
export * from './contracts';
export declare type baseProvisionerType = new (...a: any[]) => Provisioner & ProvisionerBase & PrometheusProvisioner;
declare const Provisioner_base: any;
export declare class Provisioner extends Provisioner_base {
    prometheusNamespace: string;
    jobConfig: any;
    removeJobName: any;
    certName: any;
    certFiles: any;
    simpleServiceProvided(answers: any): boolean;
}
