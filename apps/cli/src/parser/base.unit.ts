import {BaseCommand} from './base'
import {PerformerParams} from '../performers/base'
import {IConfig} from '@oclif/config'

class TestCommand extends BaseCommand {
    async go() {
        return
    }
}
describe('BaseCommand', () => {
    test('map', async () => {
        const SOME_KEY = 'foo-bar'
        const SOME_VALUE = 'car'
        const SOME_PARAMS: PerformerParams = {
            noInput: false,
            dryRun: false,
            demo: false,
            quiet: false,
        }
        const SOME_FLAGS = {
            environment: 'staging',
        }
        SOME_FLAGS[SOME_KEY] = SOME_VALUE
        const SOME_ARGS = {
            services: ['service1', 'service2']
        }
        const SOME_ARGV = ['thing']
        const SOME_CONFIG: IConfig = {
            name: 'name'
        } as IConfig
        const baseCommand = new TestCommand(SOME_ARGV, SOME_CONFIG)
        const result1 = baseCommand['mapParams']({ ...SOME_FLAGS, ...SOME_ARGS, ...SOME_PARAMS})
        expect(result1).toEqual({ ...SOME_FLAGS, ...SOME_ARGS, ...SOME_PARAMS})

        const SOME_OTHER_KEY = 'fooBar'
        baseCommand.flagMaps[SOME_KEY] = SOME_OTHER_KEY
        const SOME_TRANSORMED_FLAGS = {
            environment: 'staging',
        }
        SOME_TRANSORMED_FLAGS[SOME_OTHER_KEY] = SOME_FLAGS[SOME_KEY]
        const result2 = baseCommand['mapParams']({ ...SOME_FLAGS, ...SOME_ARGS, ...SOME_PARAMS})
        expect(result2).toEqual({ ...SOME_TRANSORMED_FLAGS, ...SOME_ARGS, ...SOME_PARAMS})

    })
})
