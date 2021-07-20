import { Stage as KubeStage } from '@c6o/kubeclient-contracts';
import { ProvisionerManager } from '@c6o/provisioner';
import { CLIReporter } from '../display/cliReporter';
declare global {
    interface Console {
        draft: (message?: any, ...optionalParams: any[]) => (message?: any, ...optionalParams: any[]) => void;
    }
}
export declare class CLIStage extends KubeStage {
    protected reporter: CLIReporter;
    protected manager?: ProvisionerManager;
    private icons;
    private currentIcon;
    private draft;
    private timer;
    private indent;
    private fillSpaces;
    constructor(reporter: CLIReporter, manager?: ProvisionerManager);
    begin(): void;
    end(): void;
    beginRender(): void;
    render(): void;
    renderRow(): string;
}
