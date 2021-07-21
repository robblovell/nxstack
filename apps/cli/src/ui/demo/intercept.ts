import { Demo } from './base'
import { CLIStatus } from '../status'
import { getStatus } from '../../factories/status'
import { CLIReporter } from '../display'
import { InterceptorParams } from '../../services'

export class InterceptDemo<T extends InterceptorParams = InterceptorParams> extends Demo<T> {

    async demo(): Promise<void> {
        this.params.remoteService = await this.promptResource(this.params.remoteService, [], 'service')
        const status: CLIStatus = getStatus(this.display as CLIReporter)

        status.push(`Intercept starting up on ${this.params.remoteService}...`)
        await this.pause()
        status.info(`Redirecting ${this.params.remoteService}`)
        await this.pause()

        status.push(`Intercept started, requests are now sent to ${this.params.remoteService} are now redirected to localhost`)

        status.pop()
        status.pop()
    }
}
