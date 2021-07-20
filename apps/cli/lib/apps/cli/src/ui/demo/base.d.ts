import * as inquirer from 'inquirer';
import { Resource, Status } from '@c6o/kubeclient-contracts';
import { Reporter } from '../display';
import { OrchestratorParams } from '../../orchestrators';
export interface PerformerParams extends OrchestratorParams {
}
export declare abstract class Demo<O extends PerformerParams = PerformerParams> {
    protected _params: Partial<O>;
    protected display?: Reporter;
    status?: Status;
    pause: (delay?: number) => Promise<unknown>;
    constructor(_params?: Partial<O>, display?: Reporter);
    get params(): Partial<O>;
    demo(): Promise<void>;
    prompt<T>(questions: inquirer.QuestionCollection<T>, initialAnswers?: T): Promise<T>;
    ensureResourceParameter(helper: any, kind: string, namespace: string, name?: string | Array<string>): Promise<string>;
    getResourceList(helper: any, namespace?: string, name?: string): Promise<Array<Resource>>;
    findResources(helper: any, namespace: any, name: any): Promise<Array<string>>;
    promptForResource(promptText: string, resource: string, resourceChoices?: Array<string>): Promise<string>;
    resourcePrompt: (found: boolean, kind: string) => string;
    promptResource(resource: string, resourceChoices: Array<string>, kind: any): Promise<string>;
}
