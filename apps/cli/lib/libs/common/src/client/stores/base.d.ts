import 'reflect-metadata';
import { IFeathersServiceFactory } from '../../DI/interfaces';
import { Logger } from '@c6o/logger';
import { ServiceMethods } from '@feathersjs/feathers';
export interface StoreErrors {
    errors?: {
        [field: string]: string;
    };
    type?: string;
    message?: string;
}
export declare class BaseStore {
    protected logger: Logger;
    disposed: boolean;
    static instanceCounter: number;
    instanceId: any;
    busy: boolean;
    errors: StoreErrors;
    get hasErrors(): boolean;
    get isValid(): boolean;
    constructor();
    dispose(): void;
    disposeGuard(): void;
    reset(): void;
    clearErrors(): void;
    setError(field: any, message: any): void;
    clearError(field: any): void;
}
export declare class BaseServiceStore extends BaseStore {
    serviceName: string;
    feathersServiceFactory: IFeathersServiceFactory;
    protected service: ServiceMethods<unknown>;
    constructor(serviceName: string);
    init(): void;
    disposeGuard(): void;
    createService(): boolean;
}
