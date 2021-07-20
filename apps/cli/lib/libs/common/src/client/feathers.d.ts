import { IFeathersServiceFactory, IStorage } from '../';
import { Logger } from '@c6o/logger';
import { Application } from '@feathersjs/feathers';
import { ServiceMethods } from '@feathersjs/feathers';
export declare class FeathersServiceFactory implements IFeathersServiceFactory {
    client: Application<any>;
    url: string;
    storageKey: string;
    storage: IStorage;
    online: boolean;
    logger: Logger;
    init(): void;
    createService(name: any): ServiceMethods<any>;
}
