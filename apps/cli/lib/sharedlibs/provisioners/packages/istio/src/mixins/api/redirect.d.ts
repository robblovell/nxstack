import { Resource } from '@c6o/kubeclient-contracts';
import { baseProvisionerType } from '../../index';
declare module '../../index' {
    interface Provisioner {
        gateway: Resource;
    }
}
export declare const httpsRedirectApiMixin: (base: baseProvisionerType) => {
    new (...a: any[]): {
        'https-redirect': {
            find: () => Promise<any>;
            create: (data: any) => Promise<any>;
        };
        gateway: {
            apiVersion: string;
            kind: string;
            metadata: {
                name: string;
                namespace: string;
            };
        };
        findGateway(): Promise<import("@c6o/kubeclient-contracts").Result>;
        setHttpsRedirect(enable: any): Promise<import("@c6o/kubeclient-contracts").Result>;
        linkGrafana(grafanaNamespace: string, serviceNamespace: string): Promise<void>;
        unlinkGrafana(serviceNamespace: string, clearLinkField?: boolean): Promise<void>;
        linkPrometheus(prometheusNamespace: string, istioNamespace: string): Promise<void>;
        unlinkPrometheus(istioNamespace: string, clearLinkField?: boolean): Promise<void>;
        upsertVirtualService(app: import("../../../../contracts/src").AppResource, gateway: string): Promise<import("@c6o/kubeclient-contracts").Result>;
        removeVirtualService(app: import("../../../../contracts/src").AppResource): Promise<void>;
        getApplicationPrefix(appName: string, namespace: string): string;
        createGateway(namespace: string, name: string, servers?: any): Promise<import("@c6o/kubeclient-contracts").Result>;
        removeGateway(namespace: string, name: string): Promise<import("@c6o/kubeclient-contracts").Result>;
        getExternalAddress(): Promise<import("../../../../contracts/src").IngressParameters>;
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
