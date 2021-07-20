import { importAll } from './importAll'
import * as fs from 'fs'

jest.mock('fs', () => {
    return {
        readdirSync: jest.fn().mockReturnValue(['file.txt', 'importAll.fixture.js']),
    }
})
import { readdirSync } from 'fs'

describe('importAll()', () => {

    beforeEach(() => {
        // Clear all instances and calls to constructor and all methods:
        //jest.clearAllMocks()
    })

    // Exception made to unit tests for this test because it is testing an import statement.
    test('importAll: With one folder and two files', async () => {
        const expected = [
            {
                'test': 1,
                'default': {
                    'test': 1
                }
            }
        ]
        const result = await importAll('./')
        expect(result).toEqual(expected)
        expect(readdirSync).toBeCalledTimes(1)
    })
})
