
import { Resource } from '@c6o/kubeclient-contracts'
import { createDebug } from '@c6o/logger'
import { ConfigMapHelper, SecretHelper, WorkloadHelper, WorkloadResource } from '@provisioner/common'
import { MonitorFactory } from '../base'
import { EnvMonitor } from './base'
import { ConfigMapEnvMonitor } from './configMap'
import { SecretEnvMonitor } from './secret'

const debug = createDebug()

export class WorkloadEnvMonitor extends EnvMonitor<WorkloadResource> {

    shallowEqual(object1, object2) {
        const keys1 = Object.keys(object1)
        const keys2 = Object.keys(object2)

        if (keys1.length !== keys2.length) {
            return false
        }

        for (const key of keys1) {
            if (object1[key] !== object2[key]) {
                return false
            }
        }

        return true
    }

    protected async onAdded() {
        this.envValues = WorkloadHelper.envToKeyValue(this.current.kind, this.current)
        const cmNames = WorkloadHelper.configMapRefs(this.current.kind, this.current)
        for (const cmName of cmNames)
            this.addChild(ConfigMapHelper.template(this.current.metadata.namespace, cmName))

        const secretNames = WorkloadHelper.secretRefs(this.current.kind, this.current)
        for (const secretName of secretNames)
            this.addChild(SecretHelper.template(this.current.metadata.namespace, secretName))

        return !cmNames.length && !secretNames.length
    }

    protected async onModified() {
        const newEnvValues = WorkloadHelper.envToKeyValue(this.current.kind, this.current)
        const isDiff = this.shallowEqual(newEnvValues, this.envValues)
        this.envValues = newEnvValues

        const cmNames = WorkloadHelper.configMapRefs(this.current.kind, this.current)
        const cmResources = cmNames.map(cmName => ConfigMapHelper.template(this.current.metadata.namespace, cmName))

        const secretNames = WorkloadHelper.secretRefs(this.current.kind, this.current)
        const secretResources = secretNames.map(secretName => SecretHelper.template(this.current.metadata.namespace, secretName))

        return isDiff || await super.reload(...cmResources, ...secretResources)
    }

    // WARNING: Would like this in EnvMonitor class but it creates
    // a circular definition that oclif does not like
    // e.g. ConfigMapEnvMonitor -> EnvMonitor -> ConfigMapEnvMonitor
    protected monitorFactory(resource: Resource): MonitorFactory {
        switch (resource.kind) {
            case 'ConfigMap':
                return ConfigMapEnvMonitor
            case 'Secret':
                return SecretEnvMonitor
            default:
                return super.monitorFactory(resource)
        }
    }

}
