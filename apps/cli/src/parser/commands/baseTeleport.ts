import { BaseCommand } from '../base'
import { KubernetesNamespacedCommand } from '../kubernetes'
import { Teleport, TeleportParams } from '../../orchestrators'
import { flags } from '@oclif/command'
import { sessionFlags } from '../flags'
import { WorkloadKinds } from '@provisioner/common'

export abstract class BaseTeleportCommand extends BaseCommand<TeleportParams> {
    static flags = {
        ...KubernetesNamespacedCommand.flags,
        ...sessionFlags(),
        file: flags.string({char: 'f', description: 'Write environment variables to a file.' }),
        output: flags.string({char: 'o', description: 'Dump out the environment variables to the shell.' }),
    }

    flagMaps = {
        ...KubernetesNamespacedCommand.flagMaps,
        file: 'envFile',
    }

    static args = [{
        name: 'resourceName',
        description: 'The name of the Kubernetes resource.',
    }]

    workloadKind: WorkloadKinds

    async go() {
        this.params.kind = this.workloadKind
        await new Teleport(this.params).apply()
    }
}