import { SessionDescription } from '../services/session';
import { Orchestrator } from './base';
import { OrchestratorParams } from './params';
import { ClusterSessionParams } from '../services';
export interface SessionOrchestratorParams extends OrchestratorParams, ClusterSessionParams {
    session?: SessionDescription;
    detail?: boolean;
    purge?: boolean;
    all?: boolean;
}
export declare class SessionOrchestrator extends Orchestrator<SessionOrchestratorParams> {
    apply(): Promise<void>;
    listSessions(): Promise<void>;
    closeSession(): Promise<void>;
    private close;
    private purge;
    private orchestratorFromSession;
}
