"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.watchMixin = void 0;
const tslib_1 = require("tslib");
const watchMixin = (base) => class watchMixinImp extends base {
    constructor() {
        super(...arguments);
        this.watchWhens = [];
        this.watchDone = (err) => {
            var _a, _b;
            if (this.watchResult)
                err ?
                    (_a = this.cluster.status) === null || _a === void 0 ? void 0 : _a.warn('Watch Error', err) :
                    (_b = this.cluster.status) === null || _b === void 0 ? void 0 : _b.info('Watch Done');
        };
        this.watchCallback = (type, obj) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            for (const [index, when] of this.watchWhens.entries()) {
                const params = {
                    type,
                    obj,
                    phase: obj.status.phase,
                    condition: this.extractConditions(obj),
                };
                if (yield when.conditionFn(params)) {
                    yield when.actionFn(this, obj, index);
                }
            }
        });
    }
    beginWatch(document) {
        if (this.watchResult)
            throw new Error('You can only create one port forward per cluster at this time');
        this.do(() => tslib_1.__awaiter(this, void 0, void 0, function* () {
            this.watchResult = yield this.cluster.watch(document, this.watchCallback, this.watchDone);
            const promise = new Promise(resolve => {
                this.watchResolver = resolve;
            });
            this.cluster.processor.waitList(promise);
            return this.watchResult;
        }));
        return this;
    }
    whenWatch(conditionFn, actionFn) {
        this.watchWhens.push({
            conditionFn,
            actionFn
        });
        return this;
    }
    extractConditions(obj) {
        if (obj.status && obj.status.conditions)
            return obj.status.conditions.reduce((accum, condition) => {
                accum[condition.type] = condition.status;
                return accum;
            }, {});
        return {};
    }
    endWatch() {
        var _a, _b;
        if ((_b = (_a = this.watchResult) === null || _a === void 0 ? void 0 : _a.other) === null || _b === void 0 ? void 0 : _b.disposer) {
            this.watchResult.other.disposer();
            if (this.watchResolver)
                this.watchResolver();
            this.watchResult = null;
            this.watchResolver = null;
            this.watchWhens.length = 0;
        }
    }
};
exports.watchMixin = watchMixin;
//# sourceMappingURL=watch.js.map