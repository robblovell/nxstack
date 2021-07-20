import { baseProvisionerType } from '../index';
import { optionFunctionType } from '@provisioner/contracts';
export declare const helpMixin: (base: baseProvisionerType) => {
    new (...a: any[]): {
        help(command: string, options: optionFunctionType, messages: string[]): void;
        controller: import("@provisioner/contracts").Controller;
        serviceName: string;
        moduleLocation: string;
        spec: any;
        serviceNamespace: string;
        routes?: any;
        logger?: any;
        readonly edition: string;
        _documentHelper: any;
        readonly documentHelper: import("@provisioner/contracts").AppHelper<import("@provisioner/contracts").AppResource>;
        serve(req: any, res: any, serverRoot?: string): void;
        serveApi(req: any, res: any): Promise<void>;
        readFile: ((...args: string[]) => Promise<string>) & ((...args: string[]) => Promise<string>);
        getIngressGatewayServiceClusterIp: (() => Promise<any>) & (() => Promise<string>);
        providedDeprovisionOption(option: any, answers?: any): any;
        getDeprovisionOption(option: any, defaultValue: any, answers?: any): any;
        setDeprovisionOption(option: any, value: any): any;
        beginConfig(namespace: string, appNamespace: string, appName: string): Promise<void>;
        clearConfig(namespace: string, appNamespace: string, appName: string): Promise<void>;
        endConfig(): Promise<void>;
        addDataSource(name: string, spec: any): Promise<string>;
        removeDataSource(name: string): Promise<void>;
        dashboardConfigMap(namespace: string): import("@c6o/kubeclient-resources/core/v1").ConfigMap;
    };
};
