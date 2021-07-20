import { ProvisionerBase } from '@provisioner/common';
import { GrafanaProvisioner } from './contracts';
export * from './contracts';
export declare type baseProvisionerType = new (...a: any[]) => Provisioner & ProvisionerBase & GrafanaProvisioner;
declare const Provisioner_base: any;
export declare class Provisioner extends Provisioner_base {
}
