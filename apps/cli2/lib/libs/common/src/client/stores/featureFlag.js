"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeatureFlagStore = void 0;
const tslib_1 = require("tslib");
const inversify_1 = require("inversify");
const mobx_1 = require("mobx");
const splitio_1 = require("@splitsoftware/splitio");
const ulid_1 = require("ulid");
const __1 = require("../../");
let FeatureFlagStore = class FeatureFlagStore {
    constructor() {
        this._anonymousUserIdKey = 'c6o-anon';
        this.initialized = false;
    }
    init() {
        const key = this.config.get('FEATURE_AUTHORIZATION_KEY');
        if (!key)
            throw new Error('FEATURE_AUTHORIZATION_KEY is required before initializing a feature store');
        this._factory = splitio_1.SplitFactory({
            core: {
                authorizationKey: key,
                key: this._trackingId
            },
            startup: {
                requestTimeoutBeforeReady: 5,
                readyTimeout: 5
            },
            storage: {
                type: 'LOCALSTORAGE',
                prefix: 'c6o'
            }
        });
    }
    getAnonymousUser() {
        var _a, _b;
        const userId = (_a = this.storage) === null || _a === void 0 ? void 0 : _a.getItem(this._anonymousUserIdKey);
        if (userId)
            return userId;
        const newId = ulid_1.ulid();
        (_b = this.storage) === null || _b === void 0 ? void 0 : _b.setItem(this._anonymousUserIdKey, newId);
        return newId;
    }
    setUser(userId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (this._client && userId === this._trackingId)
                return;
            this._trackingId = userId || this.getAnonymousUser();
            this._client = this._factory.client(this._trackingId);
            return new Promise(resolve => {
                this._client.on(this._client.Event.SDK_READY, () => {
                    this.initialized = true;
                    this.logger.info(`User set to ${this._trackingId}`);
                    resolve('success');
                });
                this._client.on(this._client.Event.SDK_UPDATE, () => {
                    this.logger.info('Flags updated');
                });
            });
        });
    }
    flag(name, value = 'on', attributes = {}) {
        attributes._trackingId = this._trackingId;
        if (!this._client)
            return false;
        const treatment = this._client.getTreatment(name, attributes);
        this.logger.info(`Treatment ${name} is ${treatment}`);
        return treatment === value;
    }
};
tslib_1.__decorate([
    inversify_1.inject(__1.Symbols.config),
    tslib_1.__metadata("design:type", Object)
], FeatureFlagStore.prototype, "config", void 0);
tslib_1.__decorate([
    inversify_1.inject(__1.Symbols.logger),
    inversify_1.named('common:FeatureFlagStore'),
    tslib_1.__metadata("design:type", Object)
], FeatureFlagStore.prototype, "logger", void 0);
tslib_1.__decorate([
    inversify_1.inject(__1.Symbols.storage),
    inversify_1.optional(),
    tslib_1.__metadata("design:type", Object)
], FeatureFlagStore.prototype, "storage", void 0);
tslib_1.__decorate([
    mobx_1.observable,
    tslib_1.__metadata("design:type", Object)
], FeatureFlagStore.prototype, "initialized", void 0);
tslib_1.__decorate([
    inversify_1.postConstruct(),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", void 0)
], FeatureFlagStore.prototype, "init", null);
FeatureFlagStore = tslib_1.__decorate([
    inversify_1.injectable()
], FeatureFlagStore);
exports.FeatureFlagStore = FeatureFlagStore;
//# sourceMappingURL=featureFlag.js.map