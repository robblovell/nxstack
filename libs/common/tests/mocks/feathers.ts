import { Symbols, container } from '../../lib/index'
import { ulid } from 'ulid'
import { EventEmitter } from 'events'
import { inject, injectable } from 'inversify'
import {
    IFeathersServiceFactory,

} from '../../lib/index'
import { Logger } from '@c6o/logger'

export function registerFeathersServiceMock() {
    const feathersServiceMock = Symbol.for('feathersServiceMock')
    const feathers: IFeathersServiceFactory = container.get(Symbols.feathers)
    //@ts-ignore
    feathers.url = 'foo'
    const logger: Logger = container.get(Symbols.logger)

    // This is done so that we can resolve
    // FeathersServiceMock
    container.bind(feathersServiceMock).to(FeathersServiceMock)

    feathers.createService = jest.fn().mockImplementation((serviceName) => {
        logger.info(`createService called for ${serviceName}`)
        return container.get(feathersServiceMock)
    })
}

@injectable()
class FeathersServiceMock {
    defaultLimit = 2
    data = []
    emitter = new EventEmitter()

    @inject(Symbols.logger)
    logger: Logger

    on = this.emitter.on
    emit = this.emitter.emit
    loadMockData = (mockData) => this.data = mockData

    findId = (id) => this.data.find(element => element._id == id)
    findIndex = (id) => this.data.findIndex(element => element._id == id)

    get = jest.fn().mockImplementation(async (id) => {
        this.logger.info('get called')
        return await this.data[id]
    })

    find = jest.fn().mockImplementation(async (params) => {
        this.logger.info('find called', params)
        const skip = params.query?.$skip || 0
        const limit = params.query?.$limit || this.defaultLimit
        return new Promise(resolve => resolve({
            skip,
            limit,
            total: this.data.length,
            data: this.data.slice(skip, skip + limit)
        }))
    })

    create = jest.fn().mockImplementation(async (data) => {
        this.logger.info('create called')
        data._id = ulid()
        this.data.push(data)
        this.emit('created', data)
        return await data
    })

    update = jest.fn().mockImplementation(async (id, data) => {
        this.logger.info('update called')

        const index = this.findIndex(id)
        if (~index) {
            this.data[index] = data
            this.emit('updated', data)
            return await data
        }
    })

    patch = jest.fn().mockImplementation(async (id, patch) => {
        this.logger.info('patch called')
        const index = this.findIndex(id)
        if (~index) {
            const data = Object.assign(this.data[index], patch)
            this.data[index] = data
            this.emit('patched', data)
            return await data
        }
    })

    remove = jest.fn().mockImplementation(async (id) => {
        this.logger.info('remove called')
        const index = this.findIndex(id)
        if (~index) {
            const data = this.data[index]
            this.data.splice(index, 1)
            this.emit('removed', data)
            return await data
        }
    })
}
