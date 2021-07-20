import { LocalTunnelParams } from '../../services';
export declare class LocalTunnel {
    protected params: LocalTunnelParams;
    constructor(params: LocalTunnelParams);
    ensure(): Promise<void>;
}
