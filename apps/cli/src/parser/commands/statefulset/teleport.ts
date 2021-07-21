import { BaseTeleportCommand } from '../../baseTeleport'
import { WorkloadKinds } from '@provisioner/common'

export class StatefulSetTeleport extends BaseTeleportCommand {
    static description = 'Teleport from your local machine so you can reference the name of a stateful set in a network request. '

    static examples = [
        'czctl statefulset teleport halyard-backend -n halyard',
    ]

    static flags = BaseTeleportCommand.flags
    static args = BaseTeleportCommand.args

    workloadKind: WorkloadKinds = 'StatefulSet'
}