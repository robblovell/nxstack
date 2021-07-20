/*
   eslint-disable @typescript-eslint/interface-name-prefix
 */
// TODO: verify that Application<any> is the right type over AuthenticationClient.
import { Application } from '@feathersjs/feathers'

export { IConfig, IUtil } from 'config'

export interface IFeathersServiceFactory {
    createService(name: string)
    client: Application<any>
}

export interface IStorage {
    key(n) : string
    getItem<T>(key): T
    setItem<T>(key: string, value: T)
    removeItem(key: string)
    clear()
}

export type MetricType = 'counter' | 'gauge' | 'histogram'

export interface IMetric {
    type: MetricType
    name: string
    label?: string
    description?: string
    labels?: string[]
    inc?: number
    diff?: number
    val?: number
}

export interface ICounterMetric extends IMetric {
    inc: number
}
export interface IGaugeMetric extends IMetric {
    diff: number
}
export interface IHistogramMetric  extends IMetric {
    val: number
}

export interface IMetrics {
    registerCounter(name: string, help: string, values: string[])
    registerGauge(name: string, help: string, labelNames: string[])
    registerHistogram(name: string, help: string, labelNames: string[], buckets: number[])

    recordMetric(metric: IMetric)
    counter(name: string, inc: number, label?: string)
    gauge(name: string, diff: number, label?: string)
    histogram(name: string, val: number, label?: string)

    dumpContentType(): string
    dump(name?: string): string

    startTimer(options?)
    endTimer(options?)

    getHashCode(): string
}

export interface IEntity {
    _id: any
    [x: string]: any
}

export interface IEntityStore {
    busy: boolean
    entity: Partial<IEntity>
    hasEntity: boolean
    initialized: boolean
    pending: Partial<IEntity>
    create(): Promise<any>
    get(id): Promise<any>
    save(): Promise<any>
    update(): Promise<any>
    patch(): Promise<any>
    remove(): Promise<any>
}

export interface IEntityListStore {
    busy: boolean
    initialized: boolean
    fetch(query): Promise<any>
}
