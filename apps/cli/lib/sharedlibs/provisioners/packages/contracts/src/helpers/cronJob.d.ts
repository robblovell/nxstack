import { CodeZeroHelper } from "../codezero";
import { CronJob } from '@c6o/kubeclient-resources/batch/v1beta1';
export declare class CronJobHelper<T extends CronJob = CronJob> extends CodeZeroHelper<T> {
    static template: (namespace?: string, name?: string) => CronJob;
    static from: (namespace?: string, name?: string) => CronJobHelper<CronJob>;
}
