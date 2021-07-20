import { LitElement } from 'lit-element';
import { StoreFlowStep, StoreFlowMediator } from '@provisioner/contracts';
export declare class GrafanaCredentials extends LitElement implements StoreFlowStep {
    mediator: StoreFlowMediator;
    values: string[];
    get serviceSpec(): any;
    render(): import("lit-element").TemplateResult;
    begin(): Promise<void>;
    storageSelected: (e: any) => void;
    usernameChanged: (e: any) => void;
    passwordChanged: (e: any) => void;
}
