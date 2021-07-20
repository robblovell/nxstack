import { BaseTeleportCommand } from '../baseTeleport'
import { WorkloadKinds } from '@provisioner/common'

export class StatefulSetTeleport extends BaseTeleportCommand {
    static description = 'Teleport your local machine so feels like you are in a Stateful Set'

    static examples = [
        'czctl statefulset teleport halyard-backend',
    ]

    static flags = BaseTeleportCommand.flags
    static args = BaseTeleportCommand.args

    workloadKind: WorkloadKinds = 'StatefulSet'
}