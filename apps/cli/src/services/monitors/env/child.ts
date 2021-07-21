import { createDebug } from '@c6o/logger'
import { Cluster } from '@c6o/kubeclient-client'
import { WorkloadEnvMonitor } from './workload'
import { EnvMonitorParams } from './params'

const debug = createDebug()

let monitor: WorkloadEnvMonitor

const main = async (params: EnvMonitorParams) => {
    try {
        const cluster = new Cluster(params)
        params.cluster = cluster
        monitor = new WorkloadEnvMonitor(params)
        await monitor.start()
    }
    catch(ex) {
        debug('ERROR', ex)
    }
}

// If the message cannot be serialized, everything fails silently
// so be careful about what is sent over the IPC line
process.on('message', main)

process.on('SIGTERM', async () => {
    debug('monitor disconnecting')
    await monitor?.stop()
    debug('monitor disconnected')
    process.exit(0)
})
