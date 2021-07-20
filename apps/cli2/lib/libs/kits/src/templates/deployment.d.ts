import { keyValue } from '@c6o/kubeclient-contracts';
export declare function getDeploymentTemplate(name: string, namespace: string, image: string, labels: keyValue, tag?: string, imagePullPolicy?: string, command?: string[]): {
    apiVersion: string;
    kind: string;
    metadata: {
        namespace: string;
        name: string;
        labels: keyValue;
    };
    spec: {
        selector: {
            matchLabels: {
                app: string;
            };
        };
        template: {
            metadata: {
                labels: keyValue;
            };
            spec: {
                securityContext: {
                    fsGroup: number;
                };
                containers: {
                    name: string;
                    image: string;
                    imagePullPolicy: string;
                    command: string[];
                }[];
            };
        };
    };
};
export declare const getPodTemplate: (name: string, namespace: string) => {
    kind: string;
    metadata: {
        namespace: string;
        labels: {
            app: string;
        };
    };
};
