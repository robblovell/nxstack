jest.mock('./caller', () => {
    return {
        caller: () => {
            return { module: 'module', filename: 'filename' }
        }
    }
})

jest.mock('debug', () => {
    const ANOTHER_MESSAGE = 'message 0'
        return jest.fn().mockReturnValue(jest.fn().mockImplementation(aString => ANOTHER_MESSAGE))
    }
)
import { debug, createDebug } from './createDebug'
import debugLib from 'debug'

describe('createDebug function', () => {

    beforeEach(() => {
        jest.clearAllMocks()
    })
    const THE_RESULT = 'modulefilename'
    const A_MESSAGE = 'message'
    const ANOTHER_MESSAGE = 'message 0'

    describe('globals()', () => {
        it('should call debugLib', () => {
            const result = createDebug()
            expect(JSON.stringify(result)).toEqual(JSON.stringify(debugLib))
            expect(debugLib).toBeCalled()
            const mock = result(A_MESSAGE)
            expect(mock).toEqual(ANOTHER_MESSAGE) // the mock translates the message to make sure the function is called.
        })
        it('should create debug for me', () => {
            expect(JSON.stringify(debug)).toEqual(JSON.stringify(debugLib))
            const mock = debug(A_MESSAGE)
            expect(mock).toEqual(ANOTHER_MESSAGE)
        })
    })

    describe('const debug = createDebug()', () => {
        it.skip('I should be able to create debug manually', () => {
            const debug = createDebug()

            expect(debugLib).toBeCalledWith(THE_RESULT)
            const mock = debug(A_MESSAGE)
            expect(mock).toEqual(ANOTHER_MESSAGE)
        })
    })
})
