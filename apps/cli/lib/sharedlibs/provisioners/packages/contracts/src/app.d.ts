import { Resource } from '@c6o/kubeclient-contracts';
import { CodeZeroHelper, CodeZeroLabels } from './codezero';
export interface MenuItems {
    type: string;
    display: string;
    action: string;
}
export interface LaunchType {
    type?: string;
    tag?: string;
    api?: boolean;
    path?: string;
    popUp: boolean;
    local?: {
        command: string;
        args?: Array<string>;
    };
}
export interface RoutesType {
    type: 'tcp' | 'http';
    targetService: string;
    targetPort?: number;
    disabled?: boolean;
    private?: boolean;
    http?: {
        prefix?: string;
        rewrite?: string;
    };
    tcp?: {
        port?: number;
        name: string;
        strictPort?: boolean;
    };
}
export interface ServicesType {
    [key: string]: any;
}
export interface AppDocumentLabels extends CodeZeroLabels {
    'system.codezero.io/app': string;
    'system.codezero.io/id': string;
    'system.codezero.io/edition': string;
    'app.kubernetes.io/name': string;
}
export interface AppDocumentSpec {
    navstation?: boolean;
    marina?: {
        launch?: LaunchType;
        menus?: Array<MenuItems>;
    };
    provisioner?: any | 'ignore';
    services?: ServicesType;
    routes?: Array<RoutesType>;
}
export interface ServicePort {
    name?: string;
    protocol: string;
    port: number;
    [key: string]: any;
}
export interface Volume {
    name: string;
    size: string;
    mountPath: string;
    subPath?: string;
}
export declare type AppStatus = 'Installing' | 'Running' | 'Error' | 'Configuring' | 'Degraded' | 'Terminating' | 'Terminated';
export interface AppResource extends Resource {
    apiVersion: 'system.codezero.io/v1';
    kind: 'App';
    labels?: AppDocumentLabels;
    status?: AppStatus;
    spec?: AppDocumentSpec;
}
export declare const AppStatuses: {
    create: {
        Pending: AppStatus;
        Completed: AppStatus;
        Error: AppStatus;
    };
    update: {
        Pending: AppStatus;
        Completed: AppStatus;
        Error: AppStatus;
    };
    remove: {
        Pending: AppStatus;
        Completed: AppStatus;
        Error: AppStatus;
    };
};
export declare class AppHelper<T extends AppResource = AppResource> extends CodeZeroHelper<T> {
    _services: any;
    get services(): any;
    get appId(): string;
    get instanceId(): string;
    get tag(): any;
    get description(): string;
    get edition(): string;
    get provisioner(): any;
    get routes(): RoutesType[];
    get hasRoutes(): number;
    get httpRoute(): RoutesType;
    get spec(): AppDocumentSpec;
    get appEdition(): string;
    get appName(): string;
    get appNamespace(): string;
    get isNew(): boolean;
    get serviceNames(): any;
    get componentLabels(): AppDocumentLabels;
    get appComponentMergeDocument(): {
        metadata: {
            labels: AppDocumentLabels;
        };
    };
    get volumes(): Array<Volume>;
    static volumesPath(): string;
    getServiceSpec(serviceName: string): any;
    getServicePackage(serviceName: string): any;
    getServiceTagPrefix(serviceName: string): any;
    getServiceObject(serviceName: string): any;
    getServiceName: (serviceObject: any) => string;
    upsertLabel(labelName: string, labelValue: string): void;
    insertOnlyLabel(labelName: string, labelValue: string): void;
}
