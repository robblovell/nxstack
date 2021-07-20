import { ExternalService } from '../../session';
import { ForeignTunnelParams } from './params';
export declare class KubefwdTuneller extends ExternalService<ForeignTunnelParams> {
    get signature(): string;
    isKubeFwdRunning(): Promise<boolean>;
    sessionInProgress(): Promise<boolean>;
    protected cleanUpMessage(hasDependant: boolean): string;
    execute(): Promise<void>;
    waitForKubeFwd(): Promise<any>;
}
