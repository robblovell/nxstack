import { BaseServiceStore } from './base';
import { IEntityStore } from '../../';
import Ajv from 'ajv';
export declare class EntityStore extends BaseServiceStore implements IEntityStore {
    createValidator: Ajv.ValidateFunction;
    patchValidator: Ajv.ValidateFunction;
    updateValidator: Ajv.ValidateFunction;
    entity: any;
    protected _triggerInitialized: boolean;
    pending: any;
    serviceRequestSuccess: boolean;
    get hasEntity(): any;
    get hasPending(): boolean;
    get nullState(): boolean;
    private _initialized;
    get initialized(): boolean;
    get id(): any;
    set id(id: any);
    constructor(serviceName: string);
    init(): void;
    private _preServiceRequest;
    private _postServiceRequest;
    protected onUpdated(entity: any): void;
    protected onPatched(patch: any): void;
    protected onRemoved(entity: any): void;
    queryHook(): any;
    isMyEntity(entity: any): boolean;
    reset(): void;
    get(id?: any): Promise<void>;
    save(): Promise<void>;
    create(): Promise<void>;
    update(): Promise<void>;
    patch(): Promise<void>;
    remove(params?: {}): Promise<void>;
    protected mapAjvErrors(errors: any): import("./base").StoreErrors;
    protected createValidate(): void;
    protected patchValidate(): void;
    protected updateValidate(): void;
    protected propagateServiceRequestResult(store: EntityStore): void;
}