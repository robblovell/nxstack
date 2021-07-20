import { keyValue } from '@c6o/kubeclient-contracts';
export declare function getConfigTemplate(name: string, namespace: string, data: keyValue): {
    apiVersion: string;
    kind: string;
    metadata: {
        name: string;
        namespace: string;
    };
    data: keyValue;
};
