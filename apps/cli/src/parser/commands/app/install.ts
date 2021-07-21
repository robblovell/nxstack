import { flags } from '@oclif/command'
// import { AppInstallPerformer } from '../../../performers/app/install'
import { BaseCommand } from '../../base'
import { Performer } from '../../../performers/base'
import { KubernetesCommand } from '../../kubernetes'

export class AppInstall extends BaseCommand {
    // TODO: Hidden for charli.ai release
    static hidden = true
    static description = 'Install an Application from the CodeZero Library'

    static examples = [
        'czctl app install <appName>',
    ]

    static flags = {
        ...KubernetesCommand.flags,
        // command-specific flags
        registry: flags.string({ char: 'r', description: 'NPM Registry to use to obtain provisioners.' }),
        'spec-only': flags.boolean({
            char: 's',
            dependsOn: ['local'],
            description: 'Do not install - just show the spec. Only works with --local',
        }),
        namespace: flags.string({char: 'n',description: 'Namespace for the operation', }),
        local: flags.boolean({
            char: 'l',
            description: 'Run the installation locally.',
        }),
    }

    flagMaps = {
        ...KubernetesCommand.flagMaps,
        'spec-only': 'specOnly'
    }

    static args = [{
        name: 'manifest',
        description: 'The YAML manifest file of the application.',
    }]

    async go() {
        throw ('Not Implemented yet.')
        // const performer: Performer = this.factory(AppInstall, AppInstallPerformer)
        // await performer.orchestrate()
    }
}