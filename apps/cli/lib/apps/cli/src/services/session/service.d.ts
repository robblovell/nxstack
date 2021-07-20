import { Session as SessionContract } from '../contracts';
import { SessionParams } from '../params';
import { Service } from '../base';
export declare abstract class SessionService<P extends SessionParams = SessionParams> extends Service<P> {
    session: SessionContract;
    abstract signature: string;
    protected abstract sessionInProgress(): Promise<boolean>;
    protected abstract executeCleanup(): Promise<boolean>;
    protected abstract execute(): Promise<void>;
    ensureSession(): Promise<void>;
    cleanUp(endSession?: boolean): Promise<void>;
    perform(): Promise<void>;
}
