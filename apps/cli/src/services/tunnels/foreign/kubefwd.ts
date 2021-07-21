import http from 'http'
import { createDebug } from '@c6o/logger'
import { ExternalService } from '../../session'
import { ForeignTunnelParams } from './params'
import { getKubefwdCmd } from '@c6o/kubefwd'
import { NamespaceHelper } from '@provisioner/contracts'
import { env } from 'process'
import axios from 'axios'
import { attempt } from '@c6o/common'

const debug = createDebug()
export class KubefwdTuneller extends ExternalService<ForeignTunnelParams>  {

    // TODO: Explore https://www.npmjs.com/package/sudo-prompt

    get signature() { return 'foreign-tunnel' }

    async isKubeFwdRunning() {
        const namespace = await this.session.get('namespace')
        if (namespace && namespace != this.params.namespace)
            throw new Error(`Cannot start a new foreign tunnel session in ${namespace} as one is already running in ${this.params.namespace}`)
        return !!namespace
    }

    async sessionInProgress() {
        await this.isKubeFwdRunning()
        return false
    }

    protected cleanUpMessage(hasDependant: boolean) {
        return hasDependant ?
            `Leaving tunnel to ${this.params.namespace} untouched` :
            `Cleaning tunnel to ${this.params.namespace}`
    }

    async execute() {
        const running = await this.isKubeFwdRunning()
        const message = running ?
            `Tunnel into ${this.params.namespace} is already up` :
            `Starting tunnel into ${this.params.namespace}`

        await super.wrapStatus(message, async () => {
            if (!running) {
                const cmd = await getKubefwdCmd()

                // The following adds all the other namespaces after the primary namespace
                // See https://github.com/txn2/kubefwd/issues/4

                const result = await this.params.cluster.list(NamespaceHelper.template())
                result.throwIfError()
                const restNamespaces = Array.from(result.each('Namespace')).filter(n => n.metadata.name !== this.params.namespace)
                const restParams = restNamespaces.map(n => ['-n', n.metadata.name])

                await this.spawner(cmd, false, 'svc', '-n', this.params.namespace, ...[].concat.apply([], restParams))
                debug(`Checking for kubefwd sync on port ${env.KUBEFWD_SYNCED_PORT || 9003}`)
                await attempt(100, 200, async () => !!await this.waitForKubeFwd())
                await this.session.set('namespace', this.params.namespace)
            }
        })
    }

    async waitForKubeFwd() {
        const port = env.KUBEFWD_SYNCED_PORT || 9003
        const result = await axios.get(`http://localhost:${port}/status`)
        return result.status === 200 && result.data?.ready
    }
}