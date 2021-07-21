jest.mock('../../orchestrators/teleport', () => {
    const applyMock = jest.fn()
    const teleportClassMock = jest.fn().mockReturnValue({
        apply: applyMock
    })
    return {
        Teleport: teleportClassMock,
        applyMock,
        teleportClassMock,
    }
})
import {NamespaceTeleport} from '../commands/namespace/teleport'
import * as TeleportMock from '../../orchestrators/teleport'

describe('CLI Debug Parser', () => {

    test('static fields', async () => {
        expect(NamespaceTeleport.description).toBeDefined()
        expect(NamespaceTeleport.description).toEqual('Teleport your local machine so feels like you are in a Kubernetes namespace for network requests.')
        expect(NamespaceTeleport.examples).toBeDefined()
        expect(NamespaceTeleport.examples).toEqual([
            'czctl namespace teleport halyard',
        ])
        expect(NamespaceTeleport.aliases).toBeDefined()
        expect(NamespaceTeleport.aliases).toEqual([])
        expect(NamespaceTeleport.strict).toBeDefined()
        expect(NamespaceTeleport.strict).toBe(true)
        expect(NamespaceTeleport.flags).toBeDefined()
        expect(NamespaceTeleport.args).toBeDefined()
        // expect(TeleportNamespace.flags).toEqual({
        //     "demo": {
        //         "allowNo": false,
        //         "hidden": true,
        //         "parse": expect.any(Function),
        //         "type": "boolean"
        //     },
        //     "dry-run": {
        //         "allowNo": false,
        //         "hidden": true,
        //         "parse": expect.any(Function),
        //         "type": "boolean"
        //     },
        //     "file": {
        //         "char": "f",
        //         "description": "Dump out the environment variables while the shell is open.",
        //         "input": [],
        //         "multiple": false,
        //         "parse": expect.any(Function),
        //         "type": "option"
        //     },
        //     "help": {
        //         "allowNo": false,
        //         "char": "h",
        //         "description": "Show help for this command",
        //         "hidden": true,
        //         "parse": expect.any(Function),
        //         "type": "boolean"
        //     },
        //     "no-input": {
        //         "allowNo": false,
        //         "hidden": true,
        //         "parse": expect.any(Function),
        //         "type": "boolean"
        //     },
        //     "quiet": {
        //         "allowNo": false,
        //         "char": "q",
        //         "description": "Only display error messages",
        //         "parse": expect.any(Function),
        //         "type": "boolean"
        //     }
        // })
        expect(NamespaceTeleport.args).toBeDefined()
        expect(NamespaceTeleport.args).toEqual([ {
            "description": "The name of the Kubernetes resource.",
            "name": "resourceName"
        }])
    })

    test.skip('run', async () => {
        const SOME_ENVIRONMENT = 'staging'
        const SOME_ARGS: any = [SOME_ENVIRONMENT]
        const SOME_CONFIG = {
            name: 'debug',
        } as any

        const teleportEnvironment = new NamespaceTeleport(SOME_ARGS, SOME_CONFIG)
        await teleportEnvironment.run()
        expect((TeleportMock as any).teleportClassMock).toBeCalledWith({ namespace: SOME_ENVIRONMENT }, expect.any(Object))
        expect((TeleportMock as any).applyMock).toBeCalled()
    })
})
