import { flags } from '@oclif/command'
import { SessionOrchestrator, SessionOrchestratorParams } from '../../../orchestrators'
import { BaseCommand } from '../../base'
import { KubernetesCommand } from '../../kubernetes'

export class ListSession extends BaseCommand<SessionOrchestratorParams> {
    static description = 'Lists current active sessions'

    static examples = [
        '$ czctl session list',
    ]

    static flags = {
        ...KubernetesCommand.flags,
        detail: flags.boolean({char: 'd', description: 'Show sub-session information' })
    }

    flagMaps = {
        ...KubernetesCommand.flagMaps,
    }

    async go() {
        const orchestrator = new SessionOrchestrator(this.params)
        await orchestrator.listSessions()
    }
}