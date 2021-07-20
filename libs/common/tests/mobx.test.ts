import { observable, computed, action, observe } from 'mobx'

describe.skip('MOBX', () => {
    class Test {
        @observable value = 0

        constructor() {
            observe(this, 'value', (change) => console.log('CHANGE', change.oldValue, change.newValue))
        }

        badInfiniteObserve() {
            return observe(this, 'value', (change) => {
                this.value++
                return change
            })
        }

        safeInfiniteObserve() {
            return observe(this, 'value', (change) => {
                this.increment()
                return change
            })
        }

        @computed get nextAsync() {
            return new Promise(resolve => resolve(this.value = this.value + 1))
        }

        @computed get next() {
            return this.value = this.value + 1
        }

        @action.bound
        increment() {
            return this.value = this.value + 1
        }
    }

    it('Async computed', async () => {
        const test = new Test()

        test.value = 0

        expect(await test.nextAsync).toBe(1)
    })

    it('Computed', () => {
        const test = new Test()

        test.value = 0

        expect(test.next).toBe(1)
    })

    it('Action', () => {
        const test = new Test()

        expect(test.increment()).toBe(1)

        expect(test.next).toBe(2)
    })

    it.skip('Infinite observe', () => {
        const test = new Test()

        test.safeInfiniteObserve()
        expect(test.next).toThrow()
    })
})