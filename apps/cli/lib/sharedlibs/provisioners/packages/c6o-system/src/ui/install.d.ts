import { LitElement } from 'lit-element';
import { StoreFlowStep, StoreFlowMediator } from '@provisioner/contracts';
export declare class TraxittSystemSetup extends LitElement implements StoreFlowStep {
    mediator: StoreFlowMediator;
    get serviceSpec(): any;
    render(): import("lit-element").TemplateResult;
    companyNameChanged: (e: any) => void;
    clusterNameChanged: (e: any) => void;
}
