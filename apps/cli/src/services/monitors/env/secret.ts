import { Secret } from '@c6o/kubeclient-resources/core/v1'
import { SecretHelper } from '@provisioner/common'
import { EnvMonitor } from './base'


export class SecretEnvMonitor extends EnvMonitor<Secret> {
    protected async onAdded() {
        this.envValues = SecretHelper.toKeyValues(this.current)
        return true
    }

    protected async onModified() {
        this.envValues = SecretHelper.toKeyValues(this.current)
        return true
    }
}
