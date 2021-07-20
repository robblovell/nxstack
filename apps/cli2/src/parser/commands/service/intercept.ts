import { flags } from '@oclif/command'
import { BaseCommand } from '../../base'
import { KubernetesNamespacedCommand } from '../../kubernetes'
import { Intercept } from '../../../orchestrators'
import { InterceptorParams } from '../../../services'
import { sessionFlags } from '../../flags'

export class InterceptService extends BaseCommand<InterceptorParams> {
    static description = 'Intercept Service traffic to a local tunnel'

    static examples = [
        'czctl service intercept <service name> -r <remote port> -l <local port> -n <namespace>',
        'czctl service intercept foo --remotePort 3000 --namespace bar',
        'czctl service intercept foo -r 8080 -n bar'
    ]

    // Set to false so we can accept arbitrary commands after the argument
    static strict = false

    static flags = {
        ...KubernetesNamespacedCommand.flags,
        ...sessionFlags(),
        localPort: flags.integer({char: 'l', description: 'The local port number of the local service' }),
        remotePort: flags.integer({char: 'r', description: 'The remote port number of the remote service to be intercepted.' }),
        all: flags.boolean({char: 'a', description: 'Intercept all traffic irrespective of headers' }),
        header: flags.string({char: 'x', description: 'Custom intercept header and value header:value. Default is X-C6O-INTERCEPT:yes'})
    }

    flagMaps = {
        ...KubernetesNamespacedCommand.flagMaps,
        service: 'remoteService',
        port: 'remotePort'
    }

    static args = [{
        name: 'service',
        description: 'The name of the remote service to be intercepted.',
    }]

    async go() {
        await new Intercept(this.params).apply()
    }

}
