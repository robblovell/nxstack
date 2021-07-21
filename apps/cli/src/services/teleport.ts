import { TeleportParams } from './params'
import { KubefwdTuneller } from './tunnels'
import { EnvSession } from './monitors/env/'
import { CompositeService, SessionDescription } from './session'

export class Teleport extends CompositeService<TeleportParams> {
    async toDescription(): Promise<SessionDescription<TeleportParams>> {
        return {
            display: `Teleported to ${this.params.resourceQuery?.metadata?.name}`,
            cleanUpParams: {
                namespace: this.params.namespace,
                envFile: this.params.envFile,
                resourceQuery: this.params.resourceQuery,
            }
        }
    }

    async execute() {
        const action = this.params.clean ? 'Closing' : 'Starting'
        const msg = `${action} teleport session for ${this.params.resourceQuery?.kind} in ${this.params.namespaceResourceId?.metadata?.name}`

        await this.wrapStatus(msg, async () => {
            const monitor = new EnvSession(this.params)
            await monitor.perform()
            this.registerForCleanup(monitor)

            const kubeFwd = new KubefwdTuneller(this.params)
            await kubeFwd.perform()
            this.registerForCleanup(kubeFwd)
        })
    }
}