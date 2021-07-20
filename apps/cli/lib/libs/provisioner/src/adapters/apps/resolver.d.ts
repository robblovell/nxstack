import { AppResource, ResolverParams, Resolver as ResolverContract, ProvisionerBase as ProvisionerBase } from '@provisioner/contracts';
import { ProvisionerFactory } from './factory';
import { AppAdapter } from './adapter';
export declare class Resolver implements ResolverContract {
    private adapter;
    _provisionerFactory: ProvisionerFactory;
    get provisionerFactory(): ProvisionerFactory;
    constructor(adapter: AppAdapter);
    getProvisioner<T extends ProvisionerBase>(nameSpaceOrParamsOrResource: string | AppResource | ResolverParams, nameOrServiceName?: string): Promise<T>;
    paramsToAppResource(params: ResolverParams): Promise<AppResource>;
}
