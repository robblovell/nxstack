import { ExternalService } from '../../session';
import { EnvMonitorParams } from './params';
export declare class EnvSession extends ExternalService<EnvMonitorParams> {
    private foregroundMonitor;
    get signature(): string;
    sessionInProgress(): Promise<boolean>;
    performForeground(): Promise<void>;
    performForegroundCleanup(): Promise<boolean>;
    performBackground(): Promise<void>;
    protected cleanUpMessage(): string;
    protected onSpawn(): Promise<void>;
}
