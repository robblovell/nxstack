import { flags } from '@oclif/command'
import { AppPublishPerformer } from '../../../performers/app/publish'
import { BaseCommand } from '../../base'
import { Performer } from '../../../performers/base'

export class AppPublish extends BaseCommand {
    // TODO: Hidden for charli.ai release
    static hidden = true

    static description = 'Publishes an Application to the CodeZero Library'

    static examples = [
        '$ czctl app publish my-great-app.yaml --account=bob-the-great',
    ]

    static flags = {
        ...BaseCommand.flags,
        account: flags.string({char: 'a', description: 'CodeZero ID that the application belongs to' }),
        forgive: flags.boolean({char: 'l', description: 'Skip apps with parsing errors' })
    }

    static args = [{
        name: 'manifest',
        required: true,
        description: 'Path to the Application manifest or manifest folder',
    }]

    async go() {
        const appPublisher = new AppPublishPerformer()
        await appPublisher.orchestrate()
    }
}