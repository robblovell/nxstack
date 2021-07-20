import { injectable, inject  } from 'inversify'
import { EntityListStore } from '../../'
import { Symbols } from '../'
import { Symbols as BaseStore } from '../../src'

@injectable()
export class SomeEntityList extends EntityListStore {

    @inject(BaseStore.feathers)
    feathersServiceFactory

    constructor() {
        super('entityList', Symbols.stores.someEntity)
    }
}