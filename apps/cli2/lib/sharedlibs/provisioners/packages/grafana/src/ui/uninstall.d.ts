import { LitElement } from 'lit-element';
import { StoreFlowStep, StoreFlowMediator } from '@provisioner/contracts';
export declare class UninstallVSCode extends LitElement implements StoreFlowStep {
    mediator: StoreFlowMediator;
    get serviceSpec(): any;
    render(): import("lit-element").TemplateResult;
    begin(): Promise<void>;
    checkHandler: (field: any) => (e: any) => void;
}
