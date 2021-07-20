import { BaseTeleportCommand } from '../baseTeleport'
import { WorkloadKinds } from '@provisioner/common'

export class PodTeleport extends BaseTeleportCommand {
    static description = 'Teleport your local machine so feels like you are in a Pod'

    static examples = [
        'czctl pod teleport halyard-backend',
    ]

    static flags = BaseTeleportCommand.flags

    workloadKind: WorkloadKinds = 'Pod'
}