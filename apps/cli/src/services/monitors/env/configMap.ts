import { createDebug } from '@c6o/logger'
import { ConfigMap } from '@c6o/kubeclient-resources/core/v1'
import { ConfigMapHelper } from '@provisioner/common'
import { EnvMonitor } from './base'

const debug = createDebug()

export class ConfigMapEnvMonitor extends EnvMonitor<ConfigMap> {
    protected async onAdded() {
        debug('added cm %o', this.current)
        this.envValues = ConfigMapHelper.toKeyValues(this.current)
        return true
    }

    protected async onModified() {
        debug('modified cm %o', this.current)
        this.envValues = ConfigMapHelper.toKeyValues(this.current)
        return true
    }
}
