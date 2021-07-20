import { Reporter } from '../ui/display'
import { ProvisionerManager } from '@c6o/provisioner'
import { getCluster } from './kubernetes'
import { getStatus } from './status'

export const getProvisionerManager = (reporter: Reporter, params?: any) => {
    const cluster = params ? getCluster(params) : undefined
    const manager = new ProvisionerManager({ cluster })
    const status = getStatus(reporter, manager)
    manager.status = status
    return manager
}
