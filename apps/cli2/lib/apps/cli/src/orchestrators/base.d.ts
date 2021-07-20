import { TerminalUI } from '../ui';
import { OrchestratorParams } from './params';
export declare abstract class Orchestrator<P extends OrchestratorParams = OrchestratorParams, UI extends TerminalUI<P> = TerminalUI<P>> {
    protected params: P;
    private _ui;
    get UI(): UI;
    protected newUI(): UI;
    constructor(params: P);
    abstract apply(): Promise<void>;
}
