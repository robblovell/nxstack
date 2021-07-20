import { flags } from '@oclif/command'
import { SessionOrchestrator, SessionOrchestratorParams } from '../../../orchestrators'
import { BaseCommand } from '../../base'
import { KubernetesCommand } from '../../kubernetes'

export class CloseSession extends BaseCommand<SessionOrchestratorParams> {
    static description = 'Close active sessions'

    static examples = [
        '$ czctl session close',
        '$ czctl session close --purge'
    ]
    static flags = {
        ...KubernetesCommand.flags,
        purge: flags.boolean({char: 'p', description: 'Clear knowledge of all sessions', hidden: true }),
        all: flags.boolean({char: 'a', description: 'Gracefully close all sessions' }),
    }

    flagMaps = {
        ...KubernetesCommand.flagMaps,
    }

    async go() {
        const orchestrator = new SessionOrchestrator(this.params)
        await orchestrator.closeSession()
    }
}