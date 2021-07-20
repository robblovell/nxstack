import { BaseClient } from './BaseClient'
import { ICounterMetric, IGaugeMetric, IHistogramMetric } from '../DI/interfaces'

export class MetricClient extends BaseClient {

    get apiURL()  { return `${process.env.HUB_SERVER_URL || 'http://localhost:3030'}/api` }

    async init(token?, privateKey?, jwkId?) {
        await super.init(
            token || process.env.HUB_TOKEN,
            privateKey || process.env.CLUSTER_KEY,
            jwkId || process.env.CLUSTER_ID)
    }

    async upsertCounter(data: ICounterMetric) {
        data.type = 'counter'
        return this.doUpsert(data)
    }

    async upsertGauge(data: IGaugeMetric) {
        data.type = 'gauge'
        return this.doUpsert(data)
    }

    async upsertHistogram(data: IHistogramMetric) {
        data.type = 'histogram'
        return this.doUpsert(data)
    }

    async doUpsert(data) {
        const res = await this.post('metrics', data)
        return this.toData(res)
    }
}