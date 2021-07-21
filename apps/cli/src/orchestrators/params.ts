import { TerminalUIParams } from '../ui/params'

export interface OrchestratorParams extends TerminalUIParams {
    dryRun?: boolean
    spec?: boolean
}