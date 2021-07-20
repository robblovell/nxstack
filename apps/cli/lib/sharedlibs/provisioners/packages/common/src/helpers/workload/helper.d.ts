import { keyValue } from '@c6o/kubeclient-contracts';
import { WorkloadKinds, WorkloadResource } from './types';
export declare type WorkloadOrArray = WorkloadResource | WorkloadResource[];
export declare class WorkloadHelper {
    static prefix: (workloads: WorkloadOrArray) => "$[*]" | "$";
    static envToKeyValue(kind: WorkloadKinds, workloads: WorkloadOrArray, merge?: keyValue): keyValue;
    static configMapRefs(kind: WorkloadKinds, workloads: WorkloadOrArray): string[];
    static secretRefs(kind: WorkloadKinds, workloads: WorkloadOrArray): string[];
}
