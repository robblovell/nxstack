
import { BaseNamespaceHelper } from './base'
import { Namespace } from '@c6o/kubeclient-resources/core/v1'

export class EnvironmentNamespaceHelper extends BaseNamespaceHelper {
    get type() { return 'environment' }
    get typeDisplay() { return 'Environment' }

    static template = (name?: string) => ({
        apiVersion: 'v1',
        kind: 'Namespace',
        metadata: {
            ...(name ? { name } : undefined),
            labels: {
                'system.codezero.io/type': 'Environment'
            }
        }
    })

    // static from = (name?: string) =>
    //     new EnvironmentNamespaceHelper(EnvironmentNamespaceHelper.template(name) as Namespace)
}
