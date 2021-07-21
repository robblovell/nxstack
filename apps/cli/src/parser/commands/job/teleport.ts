import { BaseTeleportCommand } from '../../baseTeleport'
import { WorkloadKinds } from '@provisioner/common'

export class JobTeleport extends BaseTeleportCommand {
    static description = 'Teleport from your local machine so you can reference the name of a job in a network request. '

    static examples = [
        'czctl job teleport halyard-backend -n halyard',
    ]

    static flags = BaseTeleportCommand.flags
    static args = BaseTeleportCommand.args

    workloadKind: WorkloadKinds = 'Job'
}