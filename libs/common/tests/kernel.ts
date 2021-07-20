import {
    container,
    Symbols as BaseSymbols,
    FeathersServiceFactory,
//  Config,
    BrowserStorage
} from '../lib'
import { SilentLogger, } from '@c6o/logger'
import { SomeEntity, SomeEntityList } from './stores'
export { container } from '../lib/index'
export const Symbols = {
    ...BaseSymbols,
    stores: {
        someEntity: Symbol.for('someEntity'),
        someEntityList: Symbol.for('someEntityList')
    }
}

container.bind(Symbols.logger).to(SilentLogger).inSingletonScope()
// container.bind(Symbols.config).to(Config).inSingletonScope()
container.bind(Symbols.storage).to(BrowserStorage).inSingletonScope()
container.bind(Symbols.feathers).to(FeathersServiceFactory).inSingletonScope()
container.bind(Symbols.stores.someEntity).to(SomeEntity)
container.bind(Symbols.stores.someEntityList).to(SomeEntityList)

import { registerMocks } from './mocks/index'
registerMocks()
