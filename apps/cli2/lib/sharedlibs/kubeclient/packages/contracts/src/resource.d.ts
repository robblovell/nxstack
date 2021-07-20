export declare type keyValue = {
    [key: string]: string;
};
export declare class ResourceAddress {
    api: string;
    url: string;
    endpoint: string;
    watchEndpoint: string;
}
export interface Metadata {
    namespace?: string;
    name?: string;
    resourceVersion?: string;
    labels?: keyValue;
    annotations?: keyValue;
    deletionTimestamp?: string | Date;
    finalizers?: string[];
    uid?: string;
    ownerReferences?: Array<any>;
}
export interface Resource {
    apiVersion?: string;
    kind?: string;
    metadata?: Metadata;
    spec?: any;
    status?: any;
    items?: Array<Omit<Resource, 'apiVersion' | 'kind'>>;
}
export declare type ResourceId<R extends Resource = Resource> = {
    apiVersion: R['apiVersion'];
    kind: R['kind'];
    metadata: {
        namespace?: string;
        name: string;
        labels?: R['metadata']['labels'];
        annotations?: R['metadata']['annotations'];
    };
};
export declare const toResourceId: <R extends Resource = Resource>(resource: R) => ResourceId<R>;
