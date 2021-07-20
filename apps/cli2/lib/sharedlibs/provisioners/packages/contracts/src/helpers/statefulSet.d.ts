import { CodeZeroHelper } from "../codezero";
import { StatefulSet } from '@c6o/kubeclient-resources/apps/v1';
export declare class StatefulSetHelper<T extends StatefulSet = StatefulSet> extends CodeZeroHelper<T> {
    static template: (namespace?: string, name?: string) => StatefulSet;
    static from: (namespace?: string, name?: string) => StatefulSetHelper<StatefulSet>;
}
