import { injectable, inject  } from 'inversify'
import { Symbols, EntityStore } from '../../src'

@injectable()
export class SomeEntity extends EntityStore {

    @inject(Symbols.feathers)
    feathersServiceFactory

    constructor() {
        super('entity')
    }
}