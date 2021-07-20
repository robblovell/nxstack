import { container } from '../../'
import { Symbols } from '../'

export function commonStoreTests(symbol, serviceName) {
    test('Entity Resolvable', () => {
        const store:any = container.get(symbol)
        expect(store).toBeDefined()
    })

    test('Logger is set', () => {
        const store:any = container.get(symbol)
        expect(store.logger).toBeDefined()
    })

    test('Service  is set', () => {
        const store:any = container.get(symbol)
        expect(store.service).toBeDefined()
    })

    test('Service name is set', () => {
        const store:any = container.get(symbol)
        expect(store.serviceName).toBe(serviceName)
    })

    test('Logger is called', () => {
        const logger:any = container.get(Symbols.logger)
        expect(logger).toBeDefined()
        const spy = spyOn(logger, 'info')
        container.get(symbol)
        expect(spy).toHaveBeenCalled()
    })

    test('Init is called', () => {
        const store:any = container.get(symbol)
        const prototype = Object.getPrototypeOf(store)
        const spy = spyOn(prototype, 'init')
        container.get(symbol)
        expect(spy).toHaveBeenCalled()
    })
}
