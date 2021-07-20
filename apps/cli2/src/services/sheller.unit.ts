import {Sheller, ShellerParams} from "./sheller";

jest.mock('child_process', () => {
    const shellOnMock = jest.fn()
    const killMock = jest.fn()
    const spawnMock = {
        on: shellOnMock,
        kill: killMock,
    }
    return {
        ChildProcess: jest.fn(),
        spawn: jest.fn().mockReturnValue(spawnMock),
        SpawnOptions: jest.fn(),
        shellOnMock,
        spawnMock,
        killMock,
    }
})
import { ChildProcess, spawn, SpawnOptions } from 'child_process'
import * as child_process from 'child_process'

describe('Sheller Class', () => {
    const SOME_VALUE = 'value'
    const SOME_KEYS = {
        key: SOME_VALUE,
    }
    test('Sheller open', async () => {
        const closeMock = jest.fn()
        const SOME_SHELL = '/bin/sh'
        const saveShell = process.env.SHELL
        process.env.SHELL = SOME_SHELL
        const RESULTING_OPTIONS = {
            shell: true,
            stdio: 'inherit',
            env: {
                ...process.env,
                ...SOME_KEYS,
            }
        }
        const SOME_PARAMS: ShellerParams = {
            envKeys: SOME_KEYS
        } as any
        const sheller = new Sheller(SOME_PARAMS)
        const shell1 = await sheller['execute']()
        expect(spawn).toBeCalledWith(SOME_SHELL, [], RESULTING_OPTIONS)
        expect((child_process as any).shellOnMock).not.toBeCalledWith('close', closeMock)
        expect(shell1).toBeUndefined()
        expect(sheller['shell']).toBeDefined()
        process.env.SHELL = saveShell

        await sheller['execute']()

        expect(spawn).toBeCalledWith(SOME_SHELL, [], RESULTING_OPTIONS)
        process.env.SHELL = saveShell
    })

    test('Sheller on', async () => {
        const SOME_CALLBACK = jest.fn()
        const SOME_EVENT = 'event'
        const SOME_PARAMS: ShellerParams = {
            envKeys: SOME_KEYS
        } as any
        const sheller = new Sheller(SOME_PARAMS)
        await sheller['execute']()
        expect((child_process as any).shellOnMock).not.toBeCalledWith(SOME_EVENT, SOME_CALLBACK)

        sheller.on(SOME_EVENT, SOME_CALLBACK)
        expect((child_process as any).shellOnMock).toBeCalledWith(SOME_EVENT, SOME_CALLBACK)
    })

    test('Sheller close', async () => {
        jest.clearAllMocks()
        const SOME_PARAMS: ShellerParams = {
            envKeys: SOME_KEYS
        } as any
        const sheller = new Sheller(SOME_PARAMS)
        await sheller['execute']()

        expect(sheller['shell']).toBeDefined()
        expect((child_process as any).killMock).not.toBeCalled()
        jest.clearAllMocks()

        await sheller['executeCleanup']()
        expect((child_process as any).killMock).toBeCalled()
        jest.clearAllMocks()

        //@ts-ignore
        sheller.shell['killed'] = true
        await sheller['executeCleanup']()
        expect((child_process as any).killMock).not.toBeCalled()
    })
})