import { BaseCommand } from '../base'
import { Init } from '../../orchestrators'
import { InitParams } from '../../services/params'

export class InitCommand extends BaseCommand<InitParams> {
    static description = 'Initialize czctl for your current environment and context.'

    static examples = [
        'sudo czctl init',
    ]

    static flags = {
        ...BaseCommand.flags,
    }

    flagMaps = {
        ...BaseCommand.flagMaps,
    }

    static args = []

    async go() {
        await new Init(this.params).apply()
    }
}
