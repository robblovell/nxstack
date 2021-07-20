import { InterceptorParams } from '../services';
import { Questions } from '../ui';
import { Orchestrator } from './base';
export declare class Intercept extends Orchestrator<InterceptorParams> {
    filteredNamespaces: string[];
    apply(): Promise<void>;
    static ensureServicePort(params: any): Promise<Questions<InterceptorParams>>;
}
