import { injectable, inject, named, optional } from 'inversify'
import { Symbols, IFeathersServiceFactory, IStorage } from '../'
import { Logger } from '@c6o/logger'
import { observable } from 'mobx'
import feathers from '@feathersjs/client'
import io from 'socket.io-client'
import { Application } from '@feathersjs/feathers'
import { ServiceMethods } from '@feathersjs/feathers'
import auth from '@feathersjs/authentication-client'

@injectable()
export class FeathersServiceFactory implements IFeathersServiceFactory {
// TODO: verify that Application<any> is the right type over AuthenticationClient.
    client: Application<any>
    url: string
    storageKey: string
    storage: IStorage

    @observable online: boolean

    @inject(Symbols.logger)
    @optional()
    @named('common:feathersServiceFactory')
    logger: Logger

    init() {
        try {
            // TODO: Question -> Should these throws be caught locally?
            if (this.url === undefined)
                throw new Error('URL is required')

            if (!this.storageKey)
                throw new Error('StorageKey is required')

            this.logger?.info(`Initializing feathers factory with url ${this.url} & storage ${this.storageKey}`)

            this.client = feathers() as any as Application<any>

            const socket = io(this.url, {
                transports: ['websocket'],
                path: '/api/ws/',
                upgrade: false
              })

            this.client.configure(feathers.socketio(socket))

            if (this.storage)
                this.client.configure(auth({
                    path: '/api/authentication',
                    storage: this.storage,
                    storageKey: this.storageKey
                }))

            this.client.io.on('connect', () => this.online = true)
            this.client.io.on('disconnect', () => this.online = false)
        }
        catch(ex) {
            this.logger?.error(ex)
        }
    }

    createService(name): ServiceMethods<any> {
        // TODO: Question-> Should this be in the init above instead of here?
        if (!this.client)
            this.init()

        this.logger?.info(`Creating feathers service ${name}`)
        const service: ServiceMethods<any> = this.client.service(name)
        return service // TODO: is this always AuthenticationClient?
    }
}
