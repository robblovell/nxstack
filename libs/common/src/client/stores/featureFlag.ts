import { injectable, inject, named, optional, postConstruct } from 'inversify'
import { observable } from 'mobx'
import { Logger } from '@c6o/logger'
import { SplitFactory } from '@splitsoftware/splitio'
import { ulid } from 'ulid'
import { Symbols } from '../../'

@injectable()
export class FeatureFlagStore {

    @inject(Symbols.config)
    config

    @inject(Symbols.logger)
    @named('common:FeatureFlagStore')
    protected logger: Logger

    @inject(Symbols.storage)
    @optional()
    storage

    private _factory: SplitIO.ISDK
    private _client: SplitIO.IClient
    private _trackingId
    private _anonymousUserIdKey = 'c6o-anon'

    @observable initialized = false

    @postConstruct()
    init() {
        const key = this.config.get('FEATURE_AUTHORIZATION_KEY')
        if (!key)
            throw new Error('FEATURE_AUTHORIZATION_KEY is required before initializing a feature store')

        this._factory = SplitFactory({
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
        })
    }

    getAnonymousUser() {
        const userId = this.storage?.getItem(this._anonymousUserIdKey)
        if (userId) return userId

        const newId = ulid()
        this.storage?.setItem(this._anonymousUserIdKey, newId)
        return newId
    }

    async setUser(userId?: string) {
        if (this._client && userId === this._trackingId)
            return

        this._trackingId = userId || this.getAnonymousUser()
        this._client = this._factory.client(this._trackingId)

        return new Promise(resolve => {
            this._client.on(this._client.Event.SDK_READY, () => {
                this.initialized = true
                this.logger.info(`User set to ${this._trackingId}`)
                resolve('success') // Resolve() expects a value
            })
            this._client.on(this._client.Event.SDK_UPDATE, () => {
                this.logger.info('Flags updated')
            })
        })
    }

    flag(name: string, value = 'on', attributes: any = {}) {
        attributes._trackingId = this._trackingId
        if (!this._client)
            return false

        // Note: Split.io will return 'control' as the treatment if
        // 1. The targeting rules for a split are not defined
        // 2. The SDK does not have the feature cached
        // 3. The SDK encounters an exception
        const treatment = this._client.getTreatment(name, attributes)
        this.logger.info(`Treatment ${name} is ${treatment}`)
        return treatment === value
    }
}
