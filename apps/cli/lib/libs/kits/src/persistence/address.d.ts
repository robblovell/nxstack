export declare const concatenate: (a: any, o: any) => any;
export declare class PersistenceAddress {
    static toAddress: (kind: string, name: string, namespace: string, apiVersion: string) => {
        apiVersion: string;
        kind: string;
        metadata: {
            namespace: string;
            name: string;
        };
    };
    static toPersisentVolumeAddress: (name: string) => {
        apiVersion: string;
        kind: string;
        metadata: {
            name: string;
        };
    };
    static toPersisentVolumeClaimAddress: (namespace: string, name: string) => {
        apiVersion: string;
        kind: string;
        metadata: {
            namespace: string;
            name: string;
        };
    };
    static toAppAddress: (namespace: string, appId: string) => {
        apiVersion: string;
        kind: string;
        metadata: {
            namespace: string;
            name: string;
        };
    };
    static toDeploymentAddress: (namespace: string, appId: string) => {
        apiVersion: string;
        kind: string;
        metadata: {
            namespace: string;
            name: string;
        };
    };
    static toStorageClassAddress: (name: string) => {
        apiVersion: string;
        kind: string;
        metadata: {
            name: string;
        };
    };
    static toVolumeSnapshotAddress: (namespace: string, name: string) => {
        apiVersion: string;
        kind: string;
        metadata: {
            namespace: string;
            name: string;
        };
    };
    static toVolumeHeader: () => {
        apiVersion: string;
        kind: string;
    };
    static toVolumeAddress: (name: string) => any;
    static toVolumeClaimLabels: (persistentVolumeClaimNamespace: string, persistentVolumeClaimName: string) => {
        'system.codezero.io/volume-claim-namespace': string;
        'system.codezero.io/volume-claim-name': string;
    };
    static toVolumeObjectLabels: (persistentVolumeClaimNamespace: string, persistentVolumeClaimName: string, persistentVolumeName: string) => any;
    static toVolumeFromVolumeClaimAddress: (persistentVolumeClaimNamespace: string, persistentVolumeClaimName: string) => any;
    static toVolumeWithVolumeObjectNamesAddress: (persistentVolumeClaimNamespace: string, persistentVolumeClaimName: string, persistentVolumeName: string) => any;
}
