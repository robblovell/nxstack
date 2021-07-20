import { generatePersistentVolumeClaim } from "./volumes"
import { ServicePort } from '@provisioner/contracts'
describe('getServiceTemplate', () => {
    const some_app = {
        componentLabels: 'label'
    }
    const some_namespace = 'namespace'
    const some_volume = {
        name: 'string',
        size: 'size',
    }

    test('toVolumeMountEntry = (volumeClaimName, mountPoint)', () => {
        expect(generatePersistentVolumeClaim(some_app as any, some_volume as any, some_namespace))
            .toEqual({
                kind: 'PersistentVolumeClaim',
                apiVersion: 'v1',
                metadata: {
                    name: some_volume.name.toLowerCase(),
                    namespace: some_namespace,
                    labels: some_app.componentLabels,
                },
                spec: {
                    accessModes: [
                        'ReadWriteOnce'
                    ],
                    resources: {
                        requests: {
                            storage: some_volume.size
                        }
                    }
                }
            })
    })

})