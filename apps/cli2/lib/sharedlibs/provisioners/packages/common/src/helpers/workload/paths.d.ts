import { WorkloadKinds } from './types';
export declare const pathToContainers: (kind: WorkloadKinds) => ".spec.containers[*]" | ".spec.template.spec.containers[*]" | ".spec.jobTemplate.spec.template.spec.containers[*]";
export declare const pathToEnv: (kind: WorkloadKinds) => string;
export declare const pathToConfigMapRefs: (kind: WorkloadKinds) => string;
export declare const pathToSecretRefs: (kind: WorkloadKinds) => string;
