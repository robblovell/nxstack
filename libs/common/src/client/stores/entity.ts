import { injectable } from 'inversify'
import { BaseServiceStore } from './base'
import { observable, action, computed } from 'mobx'
import { IEntityStore } from '../../'
import Ajv from 'ajv'

@injectable()
export class EntityStore extends BaseServiceStore implements IEntityStore {

    // Ajv validators
    createValidator: Ajv.ValidateFunction
    patchValidator: Ajv.ValidateFunction
    updateValidator: Ajv.ValidateFunction

    @observable entity: any
    @observable protected _triggerInitialized = false
    @observable pending: any = {}
    // The serviceRequestSuccess observable is used in components that want to know if
    // a CUPD operation was successful (e.g. the 'c6o-results' component),
    // and not just if the entity is error-free, which is what BaseStore.isValid tells you.
    @observable serviceRequestSuccess: boolean

    @computed get hasEntity() { return this.id }
    @computed get hasPending() { return !!Object.keys(this.pending).length }
    @computed get nullState() { return !this.hasEntity }

    // _initialized is to implement value clamping
    private _initialized: boolean
    @computed get initialized() {
        if (this._initialized)
            return this._initialized
        return this._initialized = this._triggerInitialized || !!this.id || this.hasErrors
    }

    @computed get id() { return this.entity?._id }
    set id(id: any) {
        this.get(id)
    }

    constructor(serviceName: string) {
        super(serviceName)
    }

    init(): void {
        super.init()
        if (this.service) {
            this.service.on('updated', this.onUpdated)
            this.service.on('patched', this.onPatched)
            this.service.on('removed', this.onRemoved)
        }
    }

    // Called when initiating a CUPD operation on a store (but not on a GET)
    private _preServiceRequest() {
        this.busy = true
        this.serviceRequestSuccess = false
        this.clearErrors()
    }

    // Called when the CUPD has completed, errors or not (but not on a GET)
    private _postServiceRequest() {
        this.busy = false
        if (this.isValid) {
            this.reset() // Clear pending
            this.serviceRequestSuccess = true // Make sure this comes after reset
        }
    }

    @action.bound
    protected onUpdated(entity) {
        if (!this.isMyEntity(entity))
            return
        this.entity = entity
        this.reset()
        this.logger.info(`${this.serviceName} updated`, entity)
    }

    @action.bound
    protected onPatched(patch) {
        if (!this.isMyEntity(patch))
            return
        this.entity = Object.assign(this.entity, patch)
        this.reset()
        this.logger.info(`${this.serviceName} patched`, patch)
    }

    @action.bound
    protected onRemoved(entity) {
        if (this.isMyEntity(entity)) {
            this.entity.removed = true
            this.reset()
            this.logger.info(`${this.serviceName} removed`)
        }
    }

    queryHook(): any { return {} }

    isMyEntity(entity): boolean {
        // Can't be equal if either are undefined
        if (!entity || !this.entity)
            return false
        return entity._id === this.entity._id
    }

    // Override the base store reset to also clear pending, etc.
    @action.bound
    reset() {
        super.reset()
        this.pending = {}
        this.serviceRequestSuccess = false
    }

    @action.bound
    async get(id = null) {
        this.disposeGuard()

        const entityId = id || this.entity?._id
        if (!entityId)
            throw new Error('id is required to get entity')

        try {
            // Don't call _preServiceRequest on a GET as we don't need to deal with serviceRequestSuccess,
            // but do clear any errors before making the call
            this.busy = true
            this.clearErrors()
            const query = this.queryHook()
            this.entity = await this.service.get(entityId, { query })
        }
        catch (ex) {
            this.logger.error(ex)
            this.errors = ex
        }
        finally {
            // Don't call _postServiceRequest on a GET otherwise the success message may appear when getting an entity
            this.busy = false
        }
    }

    @action.bound
    async save() {
        this.hasEntity ? await this.patch() : await this.create()
    }

    @action.bound
    async create() {
        this.disposeGuard()
        if (this.hasEntity) {
            throw new Error('Create cannot be called once an entity has been retrieved')
        }

        try {
            this._preServiceRequest()
            this.createValidate()
            if (this.isValid) // Passed the frontend validation, attempt to create
                this.entity = await this.service.create(this.pending)
        }
        catch (ex) {
            this.logger.error(ex)
            this.errors = ex
        }
        finally {
            this._postServiceRequest()
        }
    }

    @action.bound
    async update() {
        this.disposeGuard()
        if (!this.entity) {
            throw new Error('entity is required to update entity')
        }
        if (!this.id) {
            throw new Error('id is required to update entity')
        }
        if (this.entity.removed) {
            throw new Error('Attempt to update removed entity')
        }

        try {
            this._preServiceRequest()
            this.updateValidate()
            if (this.isValid) // Passed the frontend validation, attempt to update
                await this.service.update(this.id, this.entity)
        }
        catch (ex) {
            this.logger.error(ex)
            this.errors = ex
        }
        finally {
            this._postServiceRequest()
        }
    }

    @action.bound
    async patch() {
        this.disposeGuard()
        if (!this.entity) {
            throw new Error('entity is required to patch an entity')
        }
        if (!this.id) {
            throw new Error('id is required to patch entity')
        }
        if (this.entity.removed) {
            throw new Error('Attempt to patch removed entity')
        }
        if (!this.hasPending) {
            // User has initiated a patch without changing anything.
            this.setError('pending', 'No changes were made')
            return
        }

        try {
            this._preServiceRequest()
            this.patchValidate()
            if (this.isValid) // Passed the frontend validation, attempt to patch
                await this.service.patch(this.id, this.pending)
        }
        catch (ex) {
            this.logger.error(ex)
            this.errors = ex
        }
        finally {
            this._postServiceRequest()
        }
    }

    async remove(params = {}) {
        this.disposeGuard()
        if (!this.entity) {
            throw new Error('entity is required to patch an entity')
        }
        if (!this.id) {
            throw new Error('id is required to remove entity')
        }
        if (this.entity.removed) {
            throw new Error('Attempt to remove entity that has already been removed')
        }

        try {
            this._preServiceRequest()
            await this.service.remove(this.id, params)
        }
        catch (ex) {
            this.logger.error(ex)
            this.errors = ex
        }
        finally {
            this._postServiceRequest()
        }
    }

    protected mapAjvErrors(errors) {
        if (!errors || !errors.length)
            return null

        errors.map((error: any) => {
            if (error.dataPath && error.dataPath.length) {
                const field = error.dataPath.slice(1)
                this.setError(field, error.message)
            }
        })
        return this.errors
    }

    protected createValidate() {
        super.reset()
        if (this.createValidator) {
            if (!this.createValidator(this.pending)) {
                this.mapAjvErrors(this.createValidator.errors)
            }
        }
    }

    protected patchValidate() {
        super.reset()
        if (this.patchValidator) {
            if (!this.patchValidator(this.pending)) {
                this.mapAjvErrors(this.patchValidator.errors)
            }
        }
    }

    protected updateValidate() {
        super.reset()
        if (this.updateValidator) {
            if (!this.updateValidator(this.pending)) {
                this.mapAjvErrors(this.updateValidator.errors)
            }
        }
    }

    protected propagateServiceRequestResult(store: EntityStore) {
        if (store.hasErrors) {
            this.errors = store.errors
        } else {
            this.clearErrors()
            this.serviceRequestSuccess = store.serviceRequestSuccess
        }
    }
}