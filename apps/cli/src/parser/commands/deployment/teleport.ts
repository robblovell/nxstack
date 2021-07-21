import { BaseTeleportCommand } from '../../baseTeleport'
import { WorkloadKinds } from '@provisioner/common'

export class JobTeleport extends BaseTeleportCommand {
    static description = 'Teleport your local machine so you can reference the name of a deployment in a network request.'

    static examples = [
        'czctl deployment teleport halyard-backend -n halyard -f env.sh',
    ]

    static flags = BaseTeleportCommand.flags
    static args = BaseTeleportCommand.args

    workloadKind: WorkloadKinds = 'Deployment'
}
