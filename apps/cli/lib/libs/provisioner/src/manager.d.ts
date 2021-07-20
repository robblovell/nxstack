/// <reference types="node" />
import { EventEmitter } from 'events';
import { Resource, Status } from '@c6o/kubeclient-contracts';
import { Cluster } from '@c6o/kubeclient';
import { optionFunctionType } from '@provisioner/contracts';
import { Adapter } from './adapters';
import { TransactionHelper } from './transactions';
import { HubClient } from '@c6o/common';
export declare type actionType = 'create' | 'update' | 'remove';
export declare type stageType = 'load' | 'inquire' | 'validate' | 'apply' | 'done';
export interface ProvisionerManagerOptions {
    cluster?: Cluster;
    status?: Status;
    hubClient?: HubClient;
    noInput?: boolean;
}
export declare class ProvisionerManager extends EventEmitter {
    noInput?: boolean;
    cluster: Cluster;
    adapter: Adapter<Resource>;
    stage: stageType;
    action: actionType;
    _transactionHelper: TransactionHelper<Resource>;
    get transactionHelper(): TransactionHelper<Resource>;
    _status: Status;
    get status(): Status;
    set status(value: Status);
    constructor(options?: ProvisionerManagerOptions);
    setStage(stage: stageType): void;
    loadAdapter(stringOrDocument: Resource | string): Adapter<Resource>;
    load(resource: Resource): Promise<void>;
    exec(execService: string, ...execArgs: any[]): Promise<void>;
    help(command: string, option: optionFunctionType, messages: string[]): Promise<void>;
    inquire(options?: any): Promise<void>;
    validate(): Promise<void>;
    applyLocal(): Promise<void>;
    apply(): Promise<any>;
    perform(resource: Resource, action: actionType, answers?: any): Promise<any>;
}
