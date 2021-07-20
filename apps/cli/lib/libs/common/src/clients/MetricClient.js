"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetricClient = void 0;
const tslib_1 = require("tslib");
const BaseClient_1 = require("./BaseClient");
class MetricClient extends BaseClient_1.BaseClient {
    get apiURL() { return `${process.env.HUB_SERVER_URL || 'http://localhost:3030'}/api`; }
    init(token, privateKey, jwkId) {
        const _super = Object.create(null, {
            init: { get: () => super.init }
        });
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield _super.init.call(this, token || process.env.HUB_TOKEN, privateKey || process.env.CLUSTER_KEY, jwkId || process.env.CLUSTER_ID);
        });
    }
    upsertCounter(data) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            data.type = 'counter';
            return this.doUpsert(data);
        });
    }
    upsertGauge(data) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            data.type = 'gauge';
            return this.doUpsert(data);
        });
    }
    upsertHistogram(data) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            data.type = 'histogram';
            return this.doUpsert(data);
        });
    }
    doUpsert(data) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const res = yield this.post('metrics', data);
            return this.toData(res);
        });
    }
}
exports.MetricClient = MetricClient;
//# sourceMappingURL=MetricClient.js.map