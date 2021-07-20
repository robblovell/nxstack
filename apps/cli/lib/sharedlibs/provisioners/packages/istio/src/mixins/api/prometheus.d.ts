import { baseProvisionerType } from '../../index';
declare module '../../index' {
    interface Provisioner {
        linkPrometheus(prometheusNamespace: string, istioNamespace: string): Promise<void>;
        unlinkPrometheus(istioNamespace: string, clearLinkField?: boolean): Promise<void>;
    }
}
export declare const prometheusApiMixin: (base: baseProvisionerType) => {
    new (...a: any[]): {
        linkPrometheus(prometheusNamespace: any, istioNamespace: any): Promise<void>;
        unlinkPrometheus(istioNamespace: any, clearLinkField?: boolean): Promise<void>;
        loadYaml(file: any, params?: any): Promise<any>;
        linkGrafana(grafanaNamespace: string, serviceNamespace: string): Promise<void>;
        unlinkGrafana(serviceNamespace: string, clearLinkField?: boolean): Promise<void>;
        gateway: import("../../../../../../kubeclient/packages/contracts/src").Resource;
        upsertVirtualService(app: import("../../../../contracts/src").AppResource, gateway: string): Promise<import("../../../../../../kubeclient/packages/contracts/src").Result>;
        removeVirtualService(app: import("../../../../contracts/src").AppResource): Promise<void>;
        getApplicationPrefix(appName: string, namespace: string): string;
        createGateway(namespace: string, name: string, servers?: any): Promise<import("../../../../../../kubeclient/packages/contracts/src").Result>;
        removeGateway(namespace: string, name: string): Promise<import("../../../../../../kubeclient/packages/contracts/src").Result>;
        getExternalAddress(): Promise<import("../../../../contracts/src").IngressParameters>;
        setHttpsRedirect(enable: boolean): Promise<import("../../../../../../kubeclient/packages/contracts/src").Result>;
        controller: import("../../../../contracts/src").Controller;
        spec?: any;
        serviceNamespace: string;
        serviceName: string;
        getIngressGatewayServiceClusterIp(): Promise<string>;
        readFile(...args: string[]): Promise<string>;
        providedDeprovisionOption(option: any, answers?: any): any;
        getDeprovisionOption(option: any, defaultValue: any, answers?: any): any;
        setDeprovisionOption(option: any, value: any): any;
    };
};
