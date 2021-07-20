import { SessionService } from '../../session';
import { LocalTunnelParams } from './params';
export declare class NgrokTunnel extends SessionService<LocalTunnelParams> {
    static cleanUpKeys: string[];
    get signature(): string;
    sessionInProgress(): Promise<boolean>;
    protected executeCleanup(): Promise<boolean>;
    protected execute(): Promise<void>;
}
