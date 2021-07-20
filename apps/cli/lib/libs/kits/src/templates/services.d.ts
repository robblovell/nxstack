import { ServicePort } from '@provisioner/contracts';
export declare function getServiceTemplate(name: string, namespace: string, ports: ServicePort[]): {
    apiVersion: string;
    kind: string;
    metadata: {
        name: string;
        namespace: string;
    };
    spec: {
        type: string;
        ports: ServicePort[];
        selector: {
            app: string;
        };
    };
};
