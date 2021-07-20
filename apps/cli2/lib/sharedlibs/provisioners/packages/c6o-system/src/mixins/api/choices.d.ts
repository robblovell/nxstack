import { baseProvisionerType } from '../../index';
export declare const choicesApiMixin: (base: baseProvisionerType) => {
    new (...a: any[]): {
        choices: {
            find: () => Promise<{
                npmOptions: any[];
                loggerOptions: string[];
                prometheusOptions: string[];
                grafanaOptions: string[];
            }>;
        };
        getIstioProvisioner: () => Promise<import("../../../../istio/src").IstioProvisioner>;
        systemServerConfigMap(serviceNamespace: string): import("@c6o/kubeclient-resources/core/v1").ConfigMap;
        linkLogger(serviceNamespace: any, appNamespace: any, appId: any): Promise<void>;
        unlinkLogger(serviceNamespace: any): Promise<void>;
        linkNpm(serviceNamespace: string): Promise<void>;
        unlinkNpm(serviceNamespace: string): Promise<void>;
        linkGrafana(grafanaNamespace: string, serviceNamespace: string): Promise<void>;
        unlinkGrafana(serviceNamespace: string, clearLinkField?: boolean): Promise<void>;
        unlinkGrafana(serviceNamespace: string, clearLinkField?: boolean): Promise<void>;
        SYSTEM_GATEWAY_NAME: string;
        restartSystemServer(serviceNamespace: string): Promise<import("@c6o/kubeclient-resources/apps/v1").Deployment>;
        updateSystem(): Promise<void>;
        postCreateApp(appSpec: import("../../../../contracts/src").AppResource): Promise<void>;
        postUpdateApp(appSpec: import("../../../../contracts/src").AppResource): Promise<void>;
        postRemoveApp(appSpec: import("../../../../contracts/src").AppResource): Promise<void>;
        getSystemFQDN(): Promise<string>;
        controller: import("../../../../contracts/src").Controller;
        spec: any;
        serviceNamespace: string;
        serviceName: string;
        getIngressGatewayServiceClusterIp: (() => Promise<string>) & (() => Promise<any>);
        readFile: ((...args: string[]) => Promise<string>) & ((...args: string[]) => Promise<string>);
        providedDeprovisionOption(option: any, answers?: any): any;
        getDeprovisionOption(option: any, defaultValue: any, answers?: any): any;
        setDeprovisionOption(option: any, value: any): any;
        moduleLocation: string;
        routes?: any;
        logger?: any;
        readonly edition: string;
        _documentHelper: any;
        readonly documentHelper: import("../../../../contracts/src").AppHelper<import("../../../../contracts/src").AppResource>;
        help(command: string, options: import("../../../../contracts/src").optionFunctionType, messages: string[]): void;
        serve(req: any, res: any, serverRoot?: string): void;
        serveApi(req: any, res: any): Promise<void>;
    };
};
