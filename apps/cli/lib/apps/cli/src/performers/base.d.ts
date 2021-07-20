import * as inquirer from 'inquirer';
import { Status } from '@c6o/kubeclient-contracts';
import { Reporter } from '../ui/display';
import { OrchestratorParams } from '../orchestrators';
export interface PerformerParams extends OrchestratorParams {
}
export declare abstract class Performer<O extends PerformerParams = PerformerParams> {
    protected _params: Partial<O>;
    protected display?: Reporter;
    status?: Status;
    pause: (delay?: number) => Promise<unknown>;
    constructor(_params?: Partial<O>, display?: Reporter);
    get params(): Partial<O>;
    orchestrate(): Promise<void>;
    ensure(demo?: boolean): Promise<void>;
    perform(): Promise<void>;
    demo(): Promise<void>;
    prompt<T>(questions: inquirer.QuestionCollection<T>, initialAnswers?: T): Promise<T>;
}
