import { BaseTeleportCommand } from '../../baseTeleport'
import { WorkloadKinds } from '@provisioner/common'

export class NamespaceTeleport extends BaseTeleportCommand {
    static description = 'Teleport your local machine so feels like you are in a Kubernetes namespace for network requests.'

    static examples = [
        'czctl namespace teleport halyard',
    ]

    static flags = BaseTeleportCommand.flags
    static args = BaseTeleportCommand.args

    workloadKind: WorkloadKinds = 'Namespace'
}