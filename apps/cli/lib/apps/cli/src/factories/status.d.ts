import { ProvisionerManager } from '@c6o/provisioner';
import { CLIStatus } from '../ui';
import { Reporter } from '../ui/display';
export declare const getStatus: (reporter: Reporter, manager?: ProvisionerManager) => CLIStatus;
