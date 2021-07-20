import { BaseTeleportCommand } from '../baseTeleport'
import { WorkloadKinds } from '@provisioner/common'

export class JobTeleport extends BaseTeleportCommand {
    static description = 'Teleport your local machine so feels like you are in a Cron Job'

    static examples = [
        'czctl cronjob teleport halyard-backend',
    ]

    static flags = BaseTeleportCommand.flags
    static args = BaseTeleportCommand.args

    workloadKind: WorkloadKinds = 'CronJob'
}