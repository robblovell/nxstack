import { BaseTeleportCommand } from '../baseTeleport'
import { WorkloadKinds } from '@provisioner/common'

export class JobTeleport extends BaseTeleportCommand {
    static description = 'Teleport your local machine so feels like you are in a Job'

    static examples = [
        'czctl job teleport halyard-backend',
    ]

    static flags = BaseTeleportCommand.flags
    static args = BaseTeleportCommand.args

    workloadKind: WorkloadKinds = 'Job'
}