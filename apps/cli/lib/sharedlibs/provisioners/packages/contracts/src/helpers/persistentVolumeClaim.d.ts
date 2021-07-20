import { CodeZeroHelper } from "../codezero";
import { PersistentVolumeClaim } from '@c6o/kubeclient-resources/core/v1';
export declare class PersistentVolumeClaimObject<T extends PersistentVolumeClaim = PersistentVolumeClaim> extends CodeZeroHelper<T> {
    get volumeName(): any;
    get appName(): any;
}
