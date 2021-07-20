const fsMock = jest.mock('fs', () => {
    return {
        existsSync: jest.fn().mockImplementation((base) => {
            return base
        }),
        lstatSync: jest.fn().mockReturnValue(
            {
                isDirectory: () => true
            }
        )
    }
})
const pathMock = jest.mock('path', () => {
    return {
        resolve: jest.fn().mockImplementation((base, dir, file) => {
            if (base === 1) return base // first if, return true no matter what.
            if (base === 2) if (dir === 'c6o/') return base // second if.
            if (base === 3) if (dir === 'c6o.yaml') return base // third if.
            if (base === 4) if (dir === 'c6o/' && file === 'app.yaml') return base // fourth if.
            return false
        }),
        join: jest.fn(),
        dirname: jest.fn().mockReturnValue('./'),
        basename: jest.fn().mockReturnValue('basename'),
        normalize: jest.fn(),
    }
})

import {
    getPrimaryFile,
    ParseOptions,
    mergeProvisionerYaml,
    parseManifest,
    resolveKeys,
} from './parser'

import * as parser from './parser'

describe('parser helper tests', () => {
    describe('getPrimaryFile', () => {
        const options: ParseOptions = {
            rootFile: 'c6o.yaml',
            rootFolder: 'c6o/',
            folderFile: 'app.yaml'
        }

        test('getPrimaryFile, path 1', () => {
            const a_base_path = 1
            const result = getPrimaryFile(a_base_path, true, options)
            expect(result).toEqual(1)
        })
        test('getPrimaryFile, path 2', () => {
            const a_base_path = 2
            const result = getPrimaryFile(a_base_path, true, options)
            expect(result).toEqual(2)
        })
        test('getPrimaryFile, path 3', () => {
            const a_base_path = 3
            const result = getPrimaryFile(a_base_path, false, options)
            expect(result).toEqual(3)
        })
        test('getPrimaryFile, path 4', () => {
            const a_base_path = 4
            const result = getPrimaryFile(a_base_path, false, options)
            expect(result).toEqual(4)
        })
    })

    test.todo('read')
    test.todo('parseManifest')
    test.todo('mergeProvisionerYaml')

    describe('resolveKeys', () => {
        test('no data',() => {
            const a_basePath = {}
            const some_data = ''
            resolveKeys(a_basePath, some_data)
            expect(a_basePath).toEqual({})
        })
        test('array of data',() => {
            const a_basePath = {}
            const some_data = ['key']
            resolveKeys(a_basePath, some_data)
            expect(a_basePath).toEqual({})
        })
        test('object of data',() => {
            const a_basePath = {}
            const some_data = {
                key1: 1,
                key2: '2',
                key3: true,
                key4: [1, '2', true],
                key5: { keya: 1, keyb: '2', keyc: true },
                key6: {},
                key7: undefined,
            }
            const parseSpy = jest.spyOn(parser, 'parseManifest')
                .mockImplementation(value => typeof value)

            resolveKeys(a_basePath, some_data)

            expect(a_basePath).toEqual({})
            expect(some_data).toEqual({
                key1: 1,
                key2: 'string',
                key3: true,
                key4: [1, 'string', true],
                key5: { keya: 1, keyb: 'string', keyc: true },
                key6: {},
            })
            expect(parseSpy).toBeCalled()
            parseSpy.mockRestore()
        })
    })
})