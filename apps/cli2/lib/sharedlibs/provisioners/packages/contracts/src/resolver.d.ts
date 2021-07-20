import { AppResource } from './app';
import { ProvisionerBase } from './provisioner';
export declare type optionFunctionType = (string: any, description: string, autocomplete?: ReadonlyArray<string>) => void;
export declare type actionType = 'create' | 'update' | 'remove';
export declare type stageType = 'load' | 'inquire' | 'validate' | 'apply' | 'done';
export declare type transactionStateType = 'pending' | 'completed' | 'error';
export interface ResolverParams {
    appName: string;
    namespace?: string;
    serviceName?: string;
    edition?: string;
    hubToken?: string;
}
export interface Resolver {
    getProvisioner<T extends ProvisionerBase>(params: ResolverParams): Promise<T>;
    getProvisioner<T extends ProvisionerBase>(namespace: string, name: string): Promise<T>;
    getProvisioner<T extends ProvisionerBase>(appResource: AppResource, serviceName?: string): Promise<T>;
}
