import { TeleportParams as TeleportServiceParams, TeleportWorkloadKind } from '../services';
import { Orchestrator } from './base';
export interface TeleportParams extends TeleportServiceParams {
    kind: TeleportWorkloadKind;
    resourceName: string;
}
export declare class Teleport extends Orchestrator<TeleportParams> {
    filteredNamespaces: string[];
    apply(): Promise<void>;
    ensureKubefwd(): Promise<void>;
}
