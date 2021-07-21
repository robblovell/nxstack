import { BaseCommand } from './base'
import { KubernetesNamespacedCommand } from './kubernetes'
import { Teleport, TeleportParams } from '../orchestrators'
import { flags } from '@oclif/command'
import { sessionFlags } from './flags'
import { WorkloadKinds } from '@provisioner/common'

export abstract class BaseTeleportCommand extends BaseCommand<TeleportParams> {
    static flags = {
        ...KubernetesNamespacedCommand.flags,
        ...sessionFlags(),
        file: flags.string({char: 'f', description: 'Write environment variables to a file.' }),
        output: flags.boolean({char: 'o', description: 'Dump out the environment variables to the shell.', default: false, hidden: true }),
        format: flags.string({
            char: 'm',
            description: 'The format of the environment file. One of the following: sh (source-able shell file), env (env format p=v), json (JSON format), or yaml (YAML format).',
            options: ['sh', 'env', 'json', 'yaml']
        }),
    }

    flagMaps = {
        ...KubernetesNamespacedCommand.flagMaps,
        file: 'envFile',
    }

    static args = [{
        name: 'resourceName',
        description: 'The name of the Kubernetes resource.',
    }]
    static hidden = false

    workloadKind: WorkloadKinds

    async go() {
        this.params.kind = this.workloadKind
        await new Teleport(this.params).apply()
    }
}