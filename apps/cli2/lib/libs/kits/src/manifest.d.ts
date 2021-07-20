export declare const convertManifestToAppResource: (manifest: any, edition: any) => {
    apiVersion: string;
    kind: string;
    metadata: {
        name: any;
        labels: {
            'system.codezero.io/edition': any;
        };
        annotations: {
            'system.codezero.io/display': any;
            'system.codezero.io/description': any;
            'system.codezero.io/appId': any;
            'system.codezero.io/iconUrl': any;
        };
    };
    spec: any;
};
export declare const loadLocalAppManifests: (manifest: any) => any;
export declare const loadLocalAppResources: (manifest: any) => Array<any>;
export declare const convertEditions: (content: any, manifest: any) => any;
