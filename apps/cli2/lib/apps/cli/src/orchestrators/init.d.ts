import { Orchestrator } from './base';
import { InitParams } from '../services/params/init';
export declare class Init extends Orchestrator<InitParams> {
    apply(): Promise<void>;
    ensureRoot(): void;
}
