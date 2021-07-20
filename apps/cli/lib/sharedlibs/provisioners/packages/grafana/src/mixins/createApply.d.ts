import { baseProvisionerType } from '../index';
export declare const createApplyMixin: (base: baseProvisionerType) => {
    new (...a: any[]): {
        readonly nodeGrafanaPods: {
            kind: string;
            metadata: {
                namespace: string;
                labels: {
                    name: string;
                };
            };
        };
        createApply(): Promise<void>;
        ensureGrafanaIsInstalled(): Promise<void>;
        ensureGrafanaIsRunning(): Promise<void>;
        controller: import("../../../contracts/src").Controller;
        serviceName: string;
        moduleLocation: string;
        spec: any;
        serviceNamespace: string;
        routes?: any;
        logger?: any;
        readonly edition: string;
        _documentHelper: any;
        readonly documentHelper: import("../../../contracts/src").AppHelper<import("../../../contracts/src").AppResource>;
        help(command: string, options: import("../../../contracts/src").optionFunctionType, messages: string[]): void;
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