import { baseProvisionerType } from '../index';
declare module '../index' {
    interface Provisioner {
        SYSTEM_GATEWAY_NAME: string;
    }
}
export declare const createApplyMixin: (base: baseProvisionerType) => {
    new (...a: any[]): {
        externalIPAddress: any;
        SYSTEM_GATEWAY_NAME: string;
        createApply(): Promise<void>;
        gatewayServers: ({
            port: {
                name: string;
                number: number;
                protocol: string;
            };
            hosts: string[];
            tls: {
                httpsRedirect: boolean;
                mode?: undefined;
                credentialName?: undefined;
            };
        } | {
            port: {
                name: string;
                number: number;
                protocol: string;
            };
            hosts: string[];
            tls: {
                mode: string;
                credentialName: string;
                httpsRedirect?: undefined;
            };
        })[];
        traxittNamespace: {
            kind: string;
            metadata: {
                name: string;
            };
        };
        readonly host: string;
        readonly systemServerUrl: string;
        readonly systemServerCookieDomain: string;
        provisionCRDs(): Promise<void>;
        provisionSystem(): Promise<void>;
        provisionOAuth(): Promise<void>;
        provisionDock(): Promise<void>;
        provisionApps(): Promise<void>;
        provisionGateway(): Promise<void>;
        provisionRoutes(): Promise<void>;
        provisionMessaging(): Promise<void>;
        provisionCertificate(): Promise<void>;
        provisionUpdate(): Promise<void>;
        getIstioProvisioner: () => Promise<import("../../../istio/src").IstioProvisioner>;
        systemServerConfigMap(serviceNamespace: string): import("@c6o/kubeclient-resources/core/v1").ConfigMap;
        linkLogger(serviceNamespace: any, appNamespace: any, appId: any): Promise<void>;
        unlinkLogger(serviceNamespace: any): Promise<void>;
        linkNpm(serviceNamespace: string): Promise<void>;
        unlinkNpm(serviceNamespace: string): Promise<void>;
        linkGrafana(grafanaNamespace: string, serviceNamespace: string): Promise<void>;
        unlinkGrafana(serviceNamespace: string, clearLinkField?: boolean): Promise<void>;
        unlinkGrafana(serviceNamespace: string, clearLinkField?: boolean): Promise<void>;
        restartSystemServer(serviceNamespace: string): Promise<import("@c6o/kubeclient-resources/apps/v1").Deployment>;
        updateSystem(): Promise<void>;
        postCreateApp(appSpec: import("../../../contracts/src").AppResource): Promise<void>;
        postUpdateApp(appSpec: import("../../../contracts/src").AppResource): Promise<void>;
        postRemoveApp(appSpec: import("../../../contracts/src").AppResource): Promise<void>;
        getSystemFQDN(): Promise<string>;
        controller: import("../../../contracts/src").Controller;
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
        readonly documentHelper: import("../../../contracts/src").AppHelper<import("../../../contracts/src").AppResource>;
        help(command: string, options: import("../../../contracts/src").optionFunctionType, messages: string[]): void;
        serve(req: any, res: any, serverRoot?: string): void;
        serveApi(req: any, res: any): Promise<void>;
    };
};
