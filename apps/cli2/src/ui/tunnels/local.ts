import { LocalTunnelParams } from '../../services'

export class LocalTunnel {
    constructor(protected params: LocalTunnelParams) { }

    async ensure() {
        /* Nothing to do for a local tunnel at this time */
    }
}