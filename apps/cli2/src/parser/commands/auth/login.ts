import { flags } from '@oclif/command'
import { AuthLoginPerformer, AuthLoginParams } from '../../../performers/auth/login'
import { BaseCommand } from '../../base'
import { CLIStatus } from '../../../ui/status/'
import { CLIReporter } from '../../../ui/display';
import { getProvisionerManager } from '../../../factories/provisionerManager';

export class AuthLogin extends BaseCommand<AuthLoginParams> {
    // TODO: Hidden for charli.ai release
    static hidden = true

    static description = 'Log in to the CodeZero Hub'

    static flags = {
        ...BaseCommand.flags,
        token: flags.string({char: 't', description: 'Use the auth token provided', required: false }),
        yes: flags.boolean({char: 'y', description: 'If logged in, suppress confirmation prompt', required: false})
    }

    async go() {
        const performer = new AuthLoginPerformer(this.params)
        const reporter = new CLIReporter({ quiet: false }, process.stdout.write, process.stderr.write)
        const provisionerManager = getProvisionerManager(reporter)
        performer.status = new CLIStatus(reporter, provisionerManager)
        await performer.perform()
    }
}
