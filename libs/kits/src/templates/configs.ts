import { keyValue } from '@c6o/kubeclient-contracts'

export function getConfigTemplate(name: string, namespace: string, data: keyValue) {

    return {
        apiVersion: 'v1',
        kind: 'ConfigMap',
        metadata: {
            name: name ? `${name}-config` : undefined,
            namespace: namespace
        },
        data,
    }
}
