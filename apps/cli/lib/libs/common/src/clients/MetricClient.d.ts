import { BaseClient } from './BaseClient';
import { ICounterMetric, IGaugeMetric, IHistogramMetric } from '../DI/interfaces';
export declare class MetricClient extends BaseClient {
    get apiURL(): string;
    init(token?: any, privateKey?: any, jwkId?: any): Promise<void>;
    upsertCounter(data: ICounterMetric): Promise<any>;
    upsertGauge(data: IGaugeMetric): Promise<any>;
    upsertHistogram(data: IHistogramMetric): Promise<any>;
    doUpsert(data: any): Promise<any>;
}
