import 'reflect-metadata'
import { injectable, inject, postConstruct, named } from 'inversify'
import { observable, computed, action } from 'mobx'
import { Symbols } from '../../DI/symbols'
// TODO: base.ts should not reference DI/interfaces, danger of brining in to many interfaces and circular references.
import { IFeathersServiceFactory } from '../../DI/interfaces'
import { Logger } from '@c6o/logger'
import { ServiceMethods } from '@feathersjs/feathers'

export interface StoreErrors {
    errors?: { [field: string]: string }
    type?: string
    message?: string
}

@injectable()
export class BaseStore {

    @inject(Symbols.logger)
    @named('common:BaseStore')
    protected logger: Logger

    disposed = false
    static instanceCounter = 0
    instanceId: any

    /** Indicates store is talking to the back end and awaiting data */
    @observable busy = false
    @observable errors: StoreErrors = {}

    @computed get hasErrors() { return !!Object.keys(this.errors).length || !!this.errors?.message }
    @computed get isValid() { return !this.hasErrors }

    constructor() {
        // This is used for debugging so we can ensure singletons
        // can differentiate instances in logging messages
        this.instanceId = BaseStore.instanceCounter++
    }

    dispose() {
        // this.logger.info(`Disposing instance ID ${this.instanceId}`)
        this.disposed = true
    }

    disposeGuard() {
        if (this.disposed)
            throw new Error(`Attempted to use disposed instance ID: ${this.instanceId}`)
    }

    // Override this in the child class when you want to do additional resets.
    // For example, in entity.ts we also clear 'pending' on reset.
    reset() {
        this.clearErrors()
    }

    // Clear all errors on the store, including Feathers errors.
    clearErrors() {
        this.errors = {} as StoreErrors
    }

    // Set an error on a specific field to bind the error to a form control
    setError(field, message) {
        // Note: replaceAll() fails our unit tests, so need to use a RegEx with replace()
        const regex = /\//ig
        this.errors = Object.assign({}, this.errors, {
            [field.replace(regex, '.')]: { message }
        })
    }

    // Remove just the error that is bound to a form control
    @action.bound
    clearError(field) {
        delete this.errors[field]
    }
}

@injectable()
export class BaseServiceStore extends BaseStore {

    feathersServiceFactory: IFeathersServiceFactory
    protected service: ServiceMethods<unknown>

    constructor(public serviceName: string) {
        super()
    }

    @postConstruct()
    init() {
        this.createService()
    }

    disposeGuard() {
        if (this.disposed)
            throw new Error(`Attempted to use disposed instance ID ${this.instanceId} for service: ${this.serviceName}`)
    }

    createService(): boolean {
        if (!this.serviceName)
            return false
        if (!this.feathersServiceFactory)
            throw new Error('A Feathers service factory is required')
        this.service = this.feathersServiceFactory.createService(this.serviceName)
        return true
    }
}
