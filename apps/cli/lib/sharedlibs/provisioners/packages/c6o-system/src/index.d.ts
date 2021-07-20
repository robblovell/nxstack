import { ProvisionerBase } from '@provisioner/common';
import { IstioProvisioner } from '@provisioner/istio';
import { SystemProvisioner } from './contracts';
export * from './contracts';
export * from './constants';
export declare type baseProvisionerType = new (...a: any[]) => Provisioner & ProvisionerBase;
export interface Provisioner extends SystemProvisioner {
}
declare const Provisioner_base: any;
export declare class Provisioner extends Provisioner_base {
    getIstioProvisioner: () => Promise<IstioProvisioner>;
}
