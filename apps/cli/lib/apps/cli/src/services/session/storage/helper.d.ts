import { Cluster, PatchOp, Resource } from '@c6o/kubeclient-contracts';
import { CodeZeroHelper, CodeZeroLabels } from '@provisioner/contracts';
export interface SessionDocumentLabels extends CodeZeroLabels {
    'system.codezero.io/session': string;
    'system.codezero.io/id': string;
}
export declare type SessionStatus = 'Locked' | 'Active' | 'Error';
export interface SessionResource extends Resource {
    apiVersion: 'system.codezero.io/v1';
    kind: 'Session';
    labels?: SessionDocumentLabels;
    status?: SessionStatus;
    spec?: any;
}
export declare const SessionStatuses: {
    lock: {
        Pending: SessionStatus;
        Completed: SessionStatus;
        Error: SessionStatus;
    };
};
export declare class SessionHelper<T extends SessionResource = SessionResource> extends CodeZeroHelper<T> {
    private preApplyDocument;
    _sessions: any;
    get sessions(): any;
    get instanceId(): string;
    get spec(): any;
    set spec(spec: any);
    get isNew(): boolean;
    get sessionNames(): any;
    get componentLabels(): SessionDocumentLabels;
    static template: (namespace?: string, name?: string, spec?: any) => SessionResource;
    static from: (namespace?: string, name?: string, spec?: any) => SessionHelper<SessionResource>;
    exists(cluster: Cluster, errorMessage?: string): Promise<boolean>;
    static ensureCRD(cluster: Cluster): Promise<void>;
    toPending(resource: SessionResource, action: string): Promise<void>;
    toComplete(resource: SessionResource, action: string): Promise<PatchOp>;
    removeUnset: (obj: any) => any;
    beginTransaction(cluster: Cluster): Promise<boolean>;
    endTransaction(cluster: Cluster): Promise<void>;
    getSessionSpec(sessionName: string): any;
    getSessionObject(sessionName: string): any;
    getSessionName: (sessionObject: any) => string;
}
