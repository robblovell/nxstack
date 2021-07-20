export * from './cluster';
export * from './processor';
export * from './request';
import { Job } from '@c6o/kubeclient-resources/batch/v1';
export interface Foo extends Job {
    version: string;
}
