import { CodeZeroHelper } from "../codezero";
import { Job } from '@c6o/kubeclient-resources/batch/v1';
export declare class JobHelper<T extends Job = Job> extends CodeZeroHelper<T> {
    static template: (namespace?: string, name?: string) => Job;
    static from: (namespace?: string, name?: string) => JobHelper<Job>;
}
