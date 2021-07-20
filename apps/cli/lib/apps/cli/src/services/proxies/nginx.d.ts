import { Result } from '@c6o/kubeclient-contracts';
import { ClusterSessionService } from '../session';
import { ServiceProxyParams } from './params';
export declare class NGINXServiceProxy extends ClusterSessionService<ServiceProxyParams> {
    static cleanUpKeys: string[];
    get signature(): string;
    get decoyServiceName(): string;
    get interceptName(): string;
    get addDecoy(): boolean;
    sessionInProgress(): Promise<boolean>;
    executeCleanup(): Promise<boolean>;
    private removeRoute;
    private addRoute;
    private updateRoutes;
    execute(): Promise<void>;
    private getUpstreamLocation;
    private validateHeaderKey;
    private get headerKey();
    private get headerValue();
    private createDecoy;
    private patchServiceSpec;
    stash: (config: string) => (result: Result) => Promise<void>;
    private restoration;
}
