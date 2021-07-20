import { AppHelper, Volume } from '@provisioner/contracts';
export declare function generatePersistentVolumeClaim(app: AppHelper, volume: Volume, namespace: string): {
    kind: string;
    apiVersion: string;
    metadata: {
        name: string;
        namespace: string;
        labels: import("@provisioner/contracts").AppDocumentLabels;
    };
    spec: {
        accessModes: string[];
        resources: {
            requests: {
                storage: string;
            };
        };
    };
};
