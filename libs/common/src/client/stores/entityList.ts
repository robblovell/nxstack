import { BaseServiceStore } from './base'
import { observe, observable, computed, action, reaction, runInAction, toJS } from 'mobx'
import { IEntityStore, IEntityListStore, container, EntityStore } from '../../'

const unset = -1

export class EntityListStore extends BaseServiceStore implements IEntityListStore {
    private _entityStores = []
    private filterDisposer: () => any
    private lastQuery

    /** Current page of entities retrieved */
    @observable entities: any = []
    /** Search criteria */
    @observable filter: any = {}
    /** Limit page size */
    @observable limit = unset
    /** Selected Store from the ListStore */
    @observable selectedStore: EntityStore
    /** Number of records to skip */
    @observable skip = unset
    /** Fetch states */
    @observable protected state: 'uninitialized' | 'unfiltered' | 'filtered' | 'error' = 'uninitialized'
    /** Total number of records based on filter */
    @observable total = unset

    @computed get entityStores() {
        this.logger.info(`Generating ${this.serviceName} ${this.instanceId}`, this.entities.length)

        for (const entityStore of this._entityStores)
            entityStore.dispose()

        // TODO: Check that any of our entities actually changed before recreating any new stores
        this._entityStores = this.entities.map(entity => {
            const store: IEntityStore = this.newStore()
            store.entity = entity
            return store
        })
        return this._entityStores
    }
    @computed get hasEntities() { return !!this.entities?.length }
    @computed get initialized() { return this.state !== 'uninitialized' }
    @computed get nullState() { return this.state === 'unfiltered' && !this.hasEntities }
    @computed get hasMore() { return this.entities?.length < this.total }
    @computed get hasFilter() {
        const filters = Object.keys(this.filter)
        // If the only applied filter is $sort, consider the fetch to be unfiltered
        // because we aren't removing any entities from the results
        if (filters.length === 1 && filters[0] === '$sort')
            return false
        return !!Object.keys(this.filter).length
    }

    constructor(serviceName: string, public entityStoreSymbol: symbol) {
        super(serviceName)
    }

    init() {
        super.init()

        if (this.service) {
            this.service.on('created', this.onCreated.bind(this))
            this.service.on('updated', this.onUpdated.bind(this))
            this.service.on('patched', this.onPatched.bind(this))
            this.service.on('removed', this.onDeleted.bind(this))
        }

        this.filterDisposer?.()
        this.filterDisposer = reaction(
            () => [this.skip, this.limit, this.filter],
            // suppresses updates until done as reaction side-effect runs in an action
            () => this.fetch(),
            { delay: 100 }
        )
    }

    dispose() {
        this.filterDisposer?.()
        delete this.filterDisposer

        for(const entityStore of this._entityStores)
            entityStore.dispose()

        super.dispose()
    }

    private _preServiceRequest() {
        this.busy = true
        this.clearErrors()
    }

    private _postServiceRequest() {
        this.busy = false
    }

    protected findIndex(entity) {
        return this.entities.findIndex(e => e._id === entity._id)
    }

    queryHook(): any { return {} }

    async getStore(id) {
        const store: IEntityStore = this.entityStores.find(store => store.id === id) || this.newStore()
        if (store.hasEntity) return store

        // If the entity is new, it hasn't been loaded into our store yet,
        // so fetch it and load it into the store
        await store.get(id)
        this.entities.push(store.entity)
        return store
    }

    newStore(): IEntityStore {
        return container.get(this.entityStoreSymbol)
    }

    @action.bound
    reset() {
        this.limit = this.skip = this.total = unset
        this.filter = {}
    }

    protected onCreated(entity) {
        runInAction(() => {
            const index = this.findIndex(entity)
            if (~index)
                this.entities[index] = entity
            else {
                this.entities.push(entity)
                this.logger.info(`Instance ID ${this.instanceId} with service name "${this.serviceName}" created`, entity)
            }
        })
    }

    protected onUpdated(entity) {
        runInAction(() => {
            const index = this.findIndex(entity)
            if (~index) {
                this.entities[index] = entity
                this.logger.info(`Instance ID ${this.instanceId} with service name "${this.serviceName}" updated`, entity)
            }
        })
    }

    protected onPatched(patch) {
        runInAction(() => {
            const index = this.findIndex(patch)
            if (~index) {
                const entity = this.entities[index]
                this.entities[index] = Object.assign(entity, patch)
                this.logger.info(`Instance ID ${this.instanceId} with service name "${this.serviceName}" patched`, patch)
            }
        })
    }

    protected onDeleted(entity) {
        runInAction(() => {
            const index = this.findIndex(entity)
            if (~index) {
                this.entities.splice(index, 1)
                this.logger.info(`Service name "${this.serviceName}" deleted`, entity)
            }
        })
    }

    @action.bound
    async next() {
        this.disposeGuard()
        if (this.hasMore) {
            const skip = this.entities.length
            const query = {
                ...this.queryHook(),
                ...this.filter,
                ...(this.limit !== unset ? { $limit: this.limit } : undefined),
                $skip: skip
            }
            const result = await this.service.find({ query })
            const data = (result as any).data || result
            this.entities.push(...data)

            this.saveQuery(query)
            this.logger.info(`Fetched next service name "${this.serviceName}" with Instance ID ${this.instanceId}`, this.lastQuery, result)
        }
    }

    async fetch(force = false) {
        this.disposeGuard()

        try {
            this._preServiceRequest()
            const query = {
                ...this.queryHook(),
                ...this.filter,
                ...(this.limit !== unset ? { $limit: this.limit } : undefined),
                ...(this.skip !== unset ? { $skip: this.skip } : undefined)
            }

            // Check to see if we are querying something different than
            // the last query
            if (force || this.isDifferent(query)) {
                const result = await this.service.find({ query }) as any

                runInAction(() => {
                    // TODO: maybe we need to set a "values skipped" and "resulting limit" instead of setting skip and limit
                    // this.limit = result.limit !== undefined ? result.limit : unset
                    // this.skip = result.skip !== undefined ? result.skip : unset
                    this.total = result.total !== undefined ? result.total : unset
                    this.entities = result.data || result
                })

                this.saveQuery(query)
                this.state = this.hasFilter ? 'filtered' : 'unfiltered'
                this.logger.info(`Fetch ${this.serviceName} ${this.state} ${this.instanceId}`, this.lastQuery, result)
            } else {
                this.logger.info(`SKIP Fetch ${this.serviceName} ${this.instanceId}`, this.lastQuery)
            }
        } catch (ex) {
            this.errors = ex
            this.state = 'error'
            this.logger.error(`ERROR Fetch ${this.serviceName} ${this.instanceId}`, ex)
        } finally {
            this._postServiceRequest()
        }
    }

    queryHash(query) {
        return JSON.stringify(
            toJS({
                ...query,
                $limit: this.limit,
                $skip: this.skip
            })
        )
    }
    /**
     * Saves a hash based on the query and the current limit & skip
     * @param query
     */
    saveQuery(query) {
        this.lastQuery = this.queryHash(query)
    }

    /**
     * Determines if the query is different from the last saved query
     * @param query
     */
    isDifferent(query) {
        if (!this.lastQuery)
            return true
        const queryHash = this.queryHash(query)
        return this.lastQuery !== queryHash
    }

    @action.bound
    monitor = () => observe(this.feathersServiceFactory as any, 'online', async () => await this.fetch(), true)

    /**
     * Filter the entityStores by a property, and then re-map the entities array
     * @param filter
     */
    filterEntityStores(filter: string) {
        if (this.hasEntities) {
            const stores = this.entityStores.filter(store => store[filter])
            this.entities = stores.map(store => store.entity)
        }
    }
}