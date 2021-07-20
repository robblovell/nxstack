"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const deployment_1 = require("./deployment");
describe('getConfigTemplate', () => {
    const some_name = 'name';
    const some_namespace = 'namespace';
    const some_data = { data: 'data' };
    const some_image = 'image';
    const some_labels = { label1: 'label1' };
    const some_tag = 'tag';
    const some_imagePullPolicy = 'pull_policy';
    const some_command = ['command1', 'command2'];
    test('toVolumeMountEntry', () => {
        expect(deployment_1.getDeploymentTemplate(some_name, some_namespace, some_image, some_labels, some_tag, some_imagePullPolicy, some_command))
            .toEqual({
            apiVersion: 'apps/v1',
            kind: 'Deployment',
            metadata: {
                namespace: some_namespace,
                name: some_name,
                labels: some_labels
            },
            spec: {
                selector: {
                    matchLabels: {
                        app: some_name
                    }
                },
                template: {
                    metadata: {
                        labels: some_labels
                    },
                    spec: {
                        securityContext: {
                            fsGroup: 1000,
                        },
                        containers: [{
                                name: some_name,
                                image: some_image + ':' + some_tag,
                                imagePullPolicy: 'Always',
                                command: some_command
                            }]
                    }
                }
            }
        });
        expect(deployment_1.getDeploymentTemplate(some_name, some_namespace, some_image, some_labels))
            .toEqual({
            apiVersion: 'apps/v1',
            kind: 'Deployment',
            metadata: {
                namespace: some_namespace,
                name: some_name,
                labels: some_labels
            },
            spec: {
                selector: {
                    matchLabels: {
                        app: some_name
                    }
                },
                template: {
                    metadata: {
                        labels: some_labels
                    },
                    spec: {
                        securityContext: {
                            fsGroup: 1000,
                        },
                        containers: [{
                                name: some_name,
                                image: some_image,
                                imagePullPolicy: 'IfNotPresent',
                            }]
                    }
                }
            }
        });
    });
    test('getPodTemplate = (name: string, namespace: string) ', () => {
        expect(deployment_1.getPodTemplate(some_name, some_namespace))
            .toEqual({
            kind: 'Pod',
            metadata: {
                namespace: some_namespace,
                labels: {
                    app: some_name
                }
            }
        });
    });
});
//# sourceMappingURL=deployment.unit.js.map