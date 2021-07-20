import { caller } from './caller'

jest.mock('callsite', () => {
    return jest.fn()
        // for test 1 below. call stack of 3 with no value.
        .mockReturnValueOnce( [
            null, null,
            {
                getFileName: jest.fn()
                    .mockReturnValue(null)
            }
        ])
        // for test 2 below. call stack of 3
        .mockReturnValueOnce( [
            null, null,
            {
                getLineNumber: jest.fn().mockReturnValue(1),
                getFileName: jest.fn()
                    .mockReturnValue('/thing1/packages/thing2/lib/thing3'),
            }
        ])
        // for test 3 below. (call stack of 5.
        .mockReturnValueOnce( [
            null, null, null, null, null,
            {
                getLineNumber: jest.fn().mockReturnValue(1),
                getFileName: jest.fn()
                    .mockReturnValue('/thing1/packages/thing2/lib/thing3'),
            }
        ])

        // for test 4 below. (missing 'lib' in the path)
        .mockReturnValueOnce( [
            null, null, null,
            {
                getLineNumber: jest.fn().mockReturnValue(1),
                getFileName: jest.fn()
                    .mockReturnValue('/thing1/packages/thing2/thing3'),
            }
        ])

        // for test 5 below. (missing 'lib' in the path)
        .mockReturnValueOnce( [
            null, null, null,
            {
                getLineNumber: jest.fn().mockReturnValue(1),
                getFileName: jest.fn()
                    .mockReturnValue('/thing1/thing2/lib/thing3'),
            }
        ])

        // for test 6 below. (missing 'lib' in the path)
        .mockReturnValue( [
            null, null, null,
            {
                getLineNumber: jest.fn().mockReturnValue(1),
                getFileName: jest.fn()
                    .mockReturnValue('/thing1/thing2/thing3'),
            }
        ])
    }
)

describe('caller function', () => {

    beforeEach(() => {
        jest.clearAllMocks()
    })

    // keep these tests in order, they depend upon the mockReturnValue sequence defined above.
    test('No requester obtained (call depth = 0)', async () => {
        expect(caller(0)).toEqual({
            module: 'Anonymous',
            path: 'unknown',
            filename: 'unknown',
            line: -1,
        })
    })

    // keep these tests in order, they depend upon the mockReturnValue sequence defined above.
    test('Requester obtained (call depth = 0), index of ', async () => {
        expect(caller(0)).toEqual({
            'filename': '/thing3',
            'line': 1,
            'module': ':thing2',
            'path': '/thing1/packages/thing2/lib/thing3',
        })
    })

    // keep these tests in order, they depend upon the mockReturnValue sequence defined above.
    test('Requester obtained (call depth = 1), index of ', async () => {
        expect(caller(3)).toEqual({
            'filename': '/thing3',
            'line': 1,
            'module': ':thing2',
            'path': '/thing1/packages/thing2/lib/thing3',
        })
    })
    // keep these tests in order, they depend upon the mockReturnValue sequence defined above.
    // TODO: This tests an unhappy path, I am not sure if the code it is testing is correct.
    test('Requester obtained (call depth = 1), missing lib', async () => {
        expect(caller(1)).toEqual({
            'filename': '/thing1/packages/thing2/thing3',
            'line': 1,
            'module': ':thing2',
            'path': '/thing1/packages/thing2/thing3',
        })
    })

    // keep these tests in order, they depend upon the mockReturnValue sequence defined above.
    // TODO: This tests an unhappy path, I am not sure if the code it is testing is correct.
    test('Requester obtained (call depth = 1), missing packages', async () => {
        expect(caller(1)).toEqual({
            'filename': '/thing3',
            'line': 1,
            'module': ':thing1:thing2',
            'path': '/thing1/thing2/lib/thing3',
        })
    })

    // keep these tests in order, they depend upon the mockReturnValue sequence defined above.
    // TODO: This tests an unhappy path, I am not sure if the code it is testing is correct.
    test('Requester obtained (call depth = 1), missing lib and packages', async () => {
        expect(caller(1)).toEqual({
            'filename': '/thing1/thing2/thing3',
            'line': 1,
            'module': ':thing1:thing2',
            'path': '/thing1/thing2/thing3',
        })
    })
})