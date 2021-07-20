import { LitElement } from 'lit-element';
import { TextFieldElement } from '@vaadin/vaadin-text-field/src/vaadin-text-field';
import { StoreFlowStep, StoreFlowMediator } from '@provisioner/contracts';
export declare class IstioSetup extends LitElement implements StoreFlowStep {
    mediator: StoreFlowMediator;
    get serviceSpec(): any;
    get domainField(): TextFieldElement;
    get hostnameField(): TextFieldElement;
    render(): import("lit-element").TemplateResult;
    updateHandler: (field: any) => (e: any) => void;
    isValid: () => Promise<boolean>;
    end(): Promise<boolean>;
}
