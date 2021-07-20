import { Resource } from './resource';
export declare const setLabel: <R extends Resource = Resource>(resource: R, key: string, value: string, override?: boolean) => R;
export declare const setAnnotation: <R extends Resource = Resource>(resource: R, key: string, value: string, override?: boolean) => R;
