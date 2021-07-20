import { promises as fs } from 'fs'
import path from 'path'
import { projectBaseDir } from '../../base'
import { ExternalService } from '../../session'
import { createDebug } from '@c6o/logger'
import { WorkloadEnvMonitor } from './workload'
import { EnvMonitorParams } from './params'

// NOTE: oclif uses ts-node so if we use ./ngrokChild.js as the path,
// we get the path to the src directory which sucks!
const pathToChild = path.resolve(projectBaseDir, 'lib/services/monitors/env/child.js')
const debug = createDebug()

export class EnvSession extends ExternalService<EnvMonitorParams> {
    private foregroundMonitor: WorkloadEnvMonitor

    get signature() { return `variables-${this.params.envFile}` }

    async sessionInProgress() {
        try {
            await fs.access(this.params.envFile)
            return true
        }
        catch {
            return await this.session.any(EnvSession.cleanUpKeys)
        }
    }

    async performForeground() {
        // Do not block
        this.foregroundMonitor = new WorkloadEnvMonitor(this.params)
        this.foregroundMonitor
            .start()
            .then(() => { debug('connected') })
            .catch(err => debug('ERROR', err))
    }

    async performForegroundCleanup() {
        await this.foregroundMonitor?.stop()
        return true
    }

    async performBackground() {
        if (!this.params.envFile) {
            this.params.status?.push(`Replicating environment from ${this.params.resourceQuery?.metadata.name}`)
            this.params.status?.pop(true)
            return
        }

        const msg = `Replicating environment from ${this.params.resourceQuery?.metadata.name} to ${this.params.envFile}`
        return await super.wrapStatus(msg, super.forker(pathToChild, false))
    }

    protected cleanUpMessage() {
        return this.params.envFile ?
            `Cleaning environment replication from ${this.params.resourceQuery?.metadata.name} to ${this.params.envFile}` :
            `Environment replication from ${this.params.resourceQuery?.metadata.name} skipped`
    }

    protected async onSpawn() {
        return new Promise<void>((resolve, reject) => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { cluster, status, ...rest } = this.params
            debug('sending message')
            this.child.send(rest, (err) => err ? reject(err) : resolve())
        })
    }
}
