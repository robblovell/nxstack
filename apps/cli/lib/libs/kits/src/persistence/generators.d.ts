export declare class PersistenceGenerator {
    static toVolumeMountEntry: (volumeClaimName: any, mountPoint: any) => {
        mountPath: any;
        name: any;
    };
    static toVolumeEntry: (volumeClaimName: any) => {
        name: any;
        persistentVolumeClaim: {
            claimName: any;
        };
    };
    static toExpandEntry: (newSize: number, capacityUnit?: string) => {
        spec: {
            resources: {
                requests: {
                    storage: string;
                };
            };
        };
    };
    static createVolumeTemplate: (namespace: string, persistentVolumeClaimName: string, persistentVolumeName: string) => any;
    static createSnapshotTemplate: (namespace: string, persistentVolumeClaimName: string, volumeSnapshotClassName: string, snapshotName: string) => {
        spec: {
            volumeSnapshotClassName: string;
            source: {
                persistentVolumeClaimName: string;
            };
        };
        apiVersion: string;
        kind: string;
        metadata: {
            namespace: string;
            name: string;
        };
    };
}
