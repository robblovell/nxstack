import { IstioProvisioner } from './contracts';
export * from './contracts';
export declare type baseProvisionerType = new (...a: any[]) => Provisioner & IstioProvisioner;
declare const Provisioner_base: any;
export declare class Provisioner extends Provisioner_base {
}
export * from './constants';
