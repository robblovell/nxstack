import { NgrokTunnel } from './tunnels/local/ngrok'
import { NGINXServiceProxy } from './proxies/nginx'
import { InterceptorParams } from './params'
import { CompositeService, SessionDescription } from './session'
import { NgrokProcess } from './tunnels/local/process'

export class Interceptor extends CompositeService<InterceptorParams> {

    async toDescription(): Promise<SessionDescription<InterceptorParams>> {
        return {
            display: `Intercepting ${this.params.remoteService} in ${this.params.namespace}`,
            cleanUpParams: {
                namespace: this.params.namespace,
                remoteService: this.params.remoteService,
                remotePort: this.params.remotePort,
                localPort: this.params.localPort,
                header: this.params.header
            }
        }
    }

    protected async execute() {
        const action = this.params.clean ? 'Closing' : 'Starting'
        const msg = `${action} intercept session for ${this.params.remoteService} in ${this.params.namespace}`

        await this.wrapStatus(msg, async () => {
            const ngrokProcess = new NgrokProcess(this.params)
            await ngrokProcess.perform()
            this.registerForCleanup(ngrokProcess)

            // We're connecting a service proxy to a local tunnel
            // If we've not been given a local port, listen on the same port
            // as the remote service
            this.params.localPort = this.params.localPort || this.params.remotePort

            const tunnel = new NgrokTunnel(this.params)
            await tunnel.perform()
            this.registerForCleanup(tunnel)

            this.params.upstreamURL = this.params.localTunnelURL

            const proxy = new NGINXServiceProxy(this.params)
            await proxy.perform()
            this.registerForCleanup(proxy)

            if (!this.params.clean) { // Purely for aesthetics
                this.params.status?.push('Connecting remote service to local tunnel')
                this.params.status?.pop()
            }
        })
    }
}