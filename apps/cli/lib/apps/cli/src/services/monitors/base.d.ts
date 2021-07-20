import { Resource, Watcher } from '@c6o/kubeclient-contracts';
import { Service } from '../base';
import { MonitorParams } from './params';
export declare type MonitorFactory = new (params: MonitorParams) => Monitor;
export declare class Monitor<R extends Resource = Resource, P extends MonitorParams = MonitorParams> extends Service<P> {
    watcher: Watcher;
    parent: Monitor;
    children: Map<string, Monitor<Resource, MonitorParams>>;
    protected key: string;
    protected stopped: boolean;
    protected current: R;
    start(): Promise<void>;
    stop(): Promise<void>;
    private watchDone;
    private watchCallback;
    debounce(func: any, timeout?: number): (...args: any[]) => void;
    private debouncedRefresh;
    private processRefresh;
    protected each(): any;
    protected refresh(): Promise<void>;
    protected onAdded(): Promise<boolean>;
    protected onModified(): Promise<boolean>;
    protected monitorFactory(resource: Resource): MonitorFactory;
    protected addChild(resource: Resource, key?: string): Promise<void>;
    protected removeChild(key: string, deferRefresh?: boolean): Promise<void>;
    protected reload(...resources: Resource[]): Promise<boolean>;
    private processAdded;
    private processModified;
    private processRemoved;
    static toKey(resource: Resource): string;
}
