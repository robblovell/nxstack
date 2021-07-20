import { SessionParams } from '../../params';
export interface LocalTunnelParams extends SessionParams {
    localPort?: number;
    localTunnelURL?: string;
}
