import { BaseTeleportCommand } from '../../baseTeleport'
import { WorkloadKinds } from '@provisioner/common'

export class JobTeleport extends BaseTeleportCommand {
    static description = 'Teleport from your local machine to have access to the same services and environment as the instance of this cronjob. '

    static examples = [
        'czctl cronjob teleport halyard-backend -n halyard',
    ]

    static flags = BaseTeleportCommand.flags
    static args = BaseTeleportCommand.args

    workloadKind: WorkloadKinds = 'CronJob'
}
