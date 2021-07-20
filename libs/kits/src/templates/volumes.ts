import { AppHelper, Volume } from '@provisioner/contracts'

export function generatePersistentVolumeClaim(app: AppHelper, volume: Volume, namespace: string) {

    // TODO: add the labels for codezero!
    return {
        kind: 'PersistentVolumeClaim',
        apiVersion: 'v1',
        metadata: {
            name: volume.name.toLowerCase(),
            namespace: namespace,
            labels: app.componentLabels,
        },
        spec: {
            accessModes: [
                'ReadWriteOnce'
            ],
            resources: {
                requests: {
                    storage: volume.size
                }
            }
        }
    }
}