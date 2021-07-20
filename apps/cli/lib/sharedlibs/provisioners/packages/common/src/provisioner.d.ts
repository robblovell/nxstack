import { optionFunctionType, AppHelper, ProvisionerBase as ProvisionerBaseContract, Controller } from '@provisioner/contracts';
export declare type baseProvisionerMixinType = new (...a: any[]) => ProvisionerBaseContract;
export declare class ProvisionerBasePrivate {
}
declare const provisionerBaseMixin: baseProvisionerMixinType;
export declare class ProvisionerBase extends provisionerBaseMixin {
    controller: Controller;
    serviceName: string;
    moduleLocation: string;
    spec: any;
    serviceNamespace: string;
    routes?: any;
    logger?: any;
    get edition(): string;
    _documentHelper: any;
    get documentHelper(): AppHelper;
    help(command: string, options: optionFunctionType, messages: string[]): void;
    serve(req: any, res: any, serverRoot?: string): void;
    serveApi(req: any, res: any): Promise<void>;
    readFile(...args: string[]): Promise<string>;
    getIngressGatewayServiceClusterIp(): Promise<any>;
}
export {};
