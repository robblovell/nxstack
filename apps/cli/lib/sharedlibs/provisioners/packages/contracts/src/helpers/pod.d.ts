import { CodeZeroHelper } from "../codezero";
import { Pod } from '@c6o/kubeclient-resources/core/v1';
export declare class PodHelper<T extends Pod = Pod> extends CodeZeroHelper<T> {
    static template: (namespace?: string, name?: string) => Pod;
    static from: (namespace?: string, name?: string) => PodHelper<Pod>;
}
