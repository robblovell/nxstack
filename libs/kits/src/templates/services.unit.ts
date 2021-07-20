import { getServiceTemplate } from "./services"
import { ServicePort } from '@provisioner/contracts'
describe('getServiceTemplate', () => {
    const some_name = 'name'
    const some_namespace = 'namespace'
    const some_ports: ServicePort = {
        protocol: 'string',
        port: 1000,
        something: 'any',
    }

    test('toVolumeMountEntry = (volumeClaimName, mountPoint)', () => {
        expect(getServiceTemplate(some_name, some_namespace, [some_ports]))
            .toEqual({
                apiVersion: 'v1',
                kind: 'Service',
                metadata: {
                    name: some_name,
                    namespace: some_namespace
                },
                spec: {
                    type: 'NodePort',
                    ports: [some_ports],
                    selector: { app: some_name }
                }
            })
    })

})