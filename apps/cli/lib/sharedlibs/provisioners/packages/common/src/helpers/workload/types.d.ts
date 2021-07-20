import { Namespace, Pod } from '@c6o/kubeclient-resources/core/v1';
import { Deployment, StatefulSet } from '@c6o/kubeclient-resources/apps/v1';
import { Job, CronJob } from '@c6o/kubeclient-resources/batch/v1';
export declare type WorkloadKinds = 'Pod' | 'Deployment' | 'Job' | 'CronJob' | 'StatefulSet' | 'Namespace';
export declare type WorkloadResource = Pod | Deployment | Job | CronJob | StatefulSet | Namespace;
