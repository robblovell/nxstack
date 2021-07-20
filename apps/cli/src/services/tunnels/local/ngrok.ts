import { createDebug } from '@c6o/logger'
import { SessionService } from '../../session'
import { getClient } from './client'
import { LocalTunnelParams } from './params'

const debug = createDebug()

export class NgrokTunnel extends SessionService<LocalTunnelParams> {
    static cleanUpKeys = ['local-port']

    get signature() { return `local-tunnel-${this.params.localPort}` }

    async sessionInProgress() {
        return await this.session.any(NgrokTunnel.cleanUpKeys)
    }

    protected async executeCleanup(): Promise<boolean> {
        const client = await getClient()
        if (client) {
            const port = await this.session.get<number>('local-port')
            if (port)
                await client.deleteTunnel(port)
        }
        return true
    }

    protected async execute(): Promise<void> {
        const client = await getClient()
        const params = {
            addr: this.params.localPort,
            proto: 'http',
            // eslint-disable-next-line camelcase, @typescript-eslint/camelcase
            bind_tls: false,
            name: this.params.localPort.toString()
        }
        const result = await client.createTunnel(params)
        await this.session.set('local-port', this.params.localPort)

        this.params.localTunnelURL = result.public_url
    }
}
