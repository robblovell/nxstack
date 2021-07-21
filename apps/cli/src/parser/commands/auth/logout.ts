import { AuthLogoutPerformer } from '../../../performers/auth/logout'
import { BaseCommand } from '../../base'

export class AuthLogout extends BaseCommand {
    // TODO: Hidden for charli.ai release
    static hidden = true

    static description = 'Log out of the CodeZero Hub'

    static examples = [
        'czctl auth logout',
    ]

    // override the base run so that only perform is called.
    async go() {
        const performer = new AuthLogoutPerformer()
        await performer.perform()
    }
}