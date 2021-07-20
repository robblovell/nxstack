import { Service } from '../base';
import { SessionParams } from '../params';
import { Factory } from '../../orchestrators/factory';
import { Session as SessionContract } from '../contracts';
export interface SessionDescription<P extends SessionParams = SessionParams> {
    display: string;
    handler?: string;
    signatures?: string[];
    cleanUpParams?: P;
}
export interface SubService {
    signature: string;
    session: SessionContract;
    cleanUp(endSession: boolean): Promise<void>;
}
export interface CleanupHandler {
    apply(): Promise<void>;
}
export declare abstract class CompositeService<P extends SessionParams> extends Service<P> {
    protected abstract execute(): Promise<void>;
    protected abstract toDescription(): Promise<SessionDescription<P>>;
    private handlerName;
    private subServices;
    registerForCleanup(subService: SubService): void;
    get signatures(): string[];
    private getSession;
    private postProcess;
    perform(handlerName: keyof typeof Factory): Promise<void>;
    private cleanUp;
    wait(): Promise<unknown>;
}
