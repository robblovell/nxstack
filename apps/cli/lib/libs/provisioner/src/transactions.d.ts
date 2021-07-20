import { Resource } from '@c6o/kubeclient-contracts';
import { Adapter } from './adapters';
export declare class TransactionHelper<R extends Resource = Resource> {
    private adapter;
    private preApplyDocument;
    constructor(adapter: Adapter<R>);
    beginTransaction(): Promise<boolean>;
    endTransaction(): Promise<void>;
    removeUnset: (obj: any) => any;
    errorTransaction(): Promise<void>;
}
