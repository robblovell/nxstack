import { Resource } from './resource';
export declare class ResourceHelper<T extends Resource = Resource> {
    resource: T;
    get isNew(): boolean;
    get name(): string;
    get namespace(): string;
    get spec(): any;
    get metadata(): import("./resource").Metadata;
    get ownerReferences(): any[];
    constructor(resource?: T);
    static isResource: <T_1 extends Resource = Resource>(object: any) => object is T_1;
    setLabel(key: string, value: string, override?: boolean): this;
    setAnnotation(key: string, value: string, override?: boolean): this;
    toString(): string;
    each(kind: string): Generator<T, void, unknown>;
}
