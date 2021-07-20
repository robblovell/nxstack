import { Resource, Status } from '@c6o/kubeclient-contracts';
import { ProvisionerManager } from '@c6o/provisioner';
import { CLIReporter } from '../display';
import { CLIStage } from './stage';
export declare class CLIStatus extends Status {
    protected reporter: CLIReporter;
    protected manager?: ProvisionerManager;
    constructor(reporter: CLIReporter, manager?: ProvisionerManager);
    newStage: () => CLIStage;
    watchRemote(target: Resource): Promise<any>;
    beginRender(): void;
    endRender(): void;
    renderWarnings(): void;
    renderErrors(): void;
    renderWarning(msg: string): void;
    renderError(msg: string): void;
}
