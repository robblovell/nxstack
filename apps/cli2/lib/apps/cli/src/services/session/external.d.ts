/// <reference types="node" />
import { ChildProcess } from 'child_process';
import { SessionParams } from '../params';
import { SessionService } from './service';
export declare abstract class ExternalService<P extends SessionParams = SessionParams> extends SessionService<P> {
    static cleanUpKeys: string[];
    protected child: ChildProcess;
    protected cleanUpMessage(hasDependant: boolean): string;
    sessionInProgress(): Promise<boolean>;
    protected executeCleanup(): Promise<boolean>;
    protected performBackground(): Promise<void>;
    protected performForeground(): Promise<void>;
    protected performForegroundCleanup(): Promise<boolean>;
    protected performBackgroundWrapper(): Promise<void>;
    execute(): Promise<void>;
    protected spawner(command: string, awaitMessage: boolean, ...args: string[]): Promise<void>;
    protected forker(pathToChild: string, awaitMessage: boolean, ...args: string[]): Promise<void>;
    protected onChildCreated(awaitMessage: boolean, resolve: any, reject: any): void;
    protected onSpawn(): Promise<void>;
    protected onMessage(msg: any): Promise<void>;
    protected detach(): void;
}
