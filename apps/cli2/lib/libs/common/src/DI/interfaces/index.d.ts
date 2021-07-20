import { Application } from '@feathersjs/feathers';
export { IConfig, IUtil } from 'config';
export interface IFeathersServiceFactory {
    createService(name: string): any;
    client: Application<any>;
}
export interface IStorage {
    key(n: any): string;
    getItem<T>(key: any): T;
    setItem<T>(key: string, value: T): any;
    removeItem(key: string): any;
    clear(): any;
}
export declare type MetricType = 'counter' | 'gauge' | 'histogram';
export interface IMetric {
    type: MetricType;
    name: string;
    label?: string;
    description?: string;
    labels?: string[];
    inc?: number;
    diff?: number;
    val?: number;
}
export interface ICounterMetric extends IMetric {
    inc: number;
}
export interface IGaugeMetric extends IMetric {
    diff: number;
}
export interface IHistogramMetric extends IMetric {
    val: number;
}
export interface IMetrics {
    registerCounter(name: string, help: string, values: string[]): any;
    registerGauge(name: string, help: string, labelNames: string[]): any;
    registerHistogram(name: string, help: string, labelNames: string[], buckets: number[]): any;
    recordMetric(metric: IMetric): any;
    counter(name: string, inc: number, label?: string): any;
    gauge(name: string, diff: number, label?: string): any;
    histogram(name: string, val: number, label?: string): any;
    dumpContentType(): string;
    dump(name?: string): string;
    startTimer(options?: any): any;
    endTimer(options?: any): any;
    getHashCode(): string;
}
export interface IEntity {
    _id: any;
    [x: string]: any;
}
export interface IEntityStore {
    busy: boolean;
    entity: Partial<IEntity>;
    hasEntity: boolean;
    initialized: boolean;
    pending: Partial<IEntity>;
    create(): Promise<any>;
    get(id: any): Promise<any>;
    save(): Promise<any>;
    update(): Promise<any>;
    patch(): Promise<any>;
    remove(): Promise<any>;
}
export interface IEntityListStore {
    busy: boolean;
    initialized: boolean;
    fetch(query: any): Promise<any>;
}
