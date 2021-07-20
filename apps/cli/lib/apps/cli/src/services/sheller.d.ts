/// <reference types="node" />
import { ChildProcess } from 'child_process';
import { keyValue } from '@c6o/kubeclient-contracts';
import { SessionService } from './session';
import { SessionParams } from './params';
export interface ShellerParams extends SessionParams {
    envKeys?: keyValue;
    shellCloseHandler?: (...args: any[]) => void;
}
export declare class Sheller extends SessionService<ShellerParams> {
    shell: ChildProcess;
    get signature(): string;
    protected execute(): Promise<void>;
    protected executeCleanup(): Promise<boolean>;
    protected sessionInProgress(): Promise<boolean>;
    on(event: string | symbol, listener: (...args: any[]) => void): this;
}
