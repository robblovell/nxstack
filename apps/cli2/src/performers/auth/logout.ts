import { AuthPerformer } from './base'

export class AuthLogoutPerformer extends AuthPerformer {

    async perform(): Promise<void> {
        const token = await super.getToken()
        if (!token || token !== 'invalid') {
            if (!this.params.dryRun)
                await super.setToken('invalid')
            this.status?.info('You have been successfully logged out')
        } else
            this.status?.warn('You were not logged in')
    }
}