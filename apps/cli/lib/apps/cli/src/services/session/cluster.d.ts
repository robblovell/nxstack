import { ClusterSessionParams } from '../params';
import { SessionService } from './service';
export declare abstract class ClusterSessionService<P extends ClusterSessionParams> extends SessionService<P> {
    sessionUserId(): Promise<string>;
    ensureSession(): Promise<void>;
}
