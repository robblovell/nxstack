import { Resource } from './resource';
export declare class Result {
    object: Resource;
    suppress: boolean;
    error: any;
    other: any;
    static undefined: Result;
    get errorMessage(): any;
    get errorCode(): any;
    get hasItems(): number;
    static from(fn: any): Promise<Result>;
    constructor(result: any);
    as<R extends Resource = Resource>(): R;
    each<R extends Resource = Resource>(kind: string): Generator<R, void, unknown>;
    throwIfError(message?: string): void;
    otherAs<T>(): any;
}
