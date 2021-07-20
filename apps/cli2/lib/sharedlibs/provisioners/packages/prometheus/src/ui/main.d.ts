import { LitElement } from 'lit-element';
import { StoreFlowStep, StoreFlowMediator } from '@provisioner/contracts';
export declare class PrometheusMainInstall extends LitElement implements StoreFlowStep {
    mediator: StoreFlowMediator;
    get serviceSpec(): any;
    isSimple: boolean;
    render(): import("lit-element").TemplateResult;
    checkHandler: (field: any) => (e: any) => void;
}
