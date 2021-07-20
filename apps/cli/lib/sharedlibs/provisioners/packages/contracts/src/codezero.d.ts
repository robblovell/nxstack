import { Resource, ResourceHelper, keyValue } from '@c6o/kubeclient-contracts';
export interface CodeZeroLabels extends keyValue {
    'app.kubernetes.io/managed-by': 'codezero';
    'system.codezero.io/display'?: string;
    'system.codezero.io/iconUrl'?: string;
}
export interface CodeZeroResource extends Resource {
    labels?: CodeZeroLabels;
}
export declare class CodeZeroHelper<T extends CodeZeroResource> extends ResourceHelper<T> {
    get displayName(): string;
    get iconUrl(): string;
    get componentLabels(): CodeZeroLabels;
}
