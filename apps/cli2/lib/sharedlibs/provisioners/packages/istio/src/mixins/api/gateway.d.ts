import { baseProvisionerType } from '../../index';
import { Result } from '@c6o/kubeclient-contracts';
export declare const gatewayApiMixin: (base: baseProvisionerType) => {
    new (...a: any[]): {
        gatewayTemplate: (namespace: any, name: any) => {
            apiVersion: string;
            kind: string;
            metadata: {
                namespace: any;
                name: any;
            };
            spec: {
                selector: {
                    istio: string;
                };
                servers: any;
            };
        };
        findGateway(namespace: any, name: any): Promise<Result>;
        createGateway(namespace: string, name: string, servers?: any): Promise<Result>;
        removeGateway(namespace: string, name: string): Promise<Result>;
        getExternalAddress(): Promise<import("../../../../contracts/src").IngressParameters>;
        linkGrafana(grafanaNamespace: string, serviceNamespace: string): Promise<void>;
        unlinkGrafana(serviceNamespace: string, clearLinkField?: boolean): Promise<void>;
        gateway: import("@c6o/kubeclient-contracts").Resource;
        linkPrometheus(prometheusNamespace: string, istioNamespace: string): Promise<void>;
        unlinkPrometheus(istioNamespace: string, clearLinkField?: boolean): Promise<void>;
        upsertVirtualService(app: import("../../../../contracts/src").AppResource, gateway: string): Promise<Result>;
        removeVirtualService(app: import("../../../../contracts/src").AppResource): Promise<void>;
        getApplicationPrefix(appName: string, namespace: string): string;
        setHttpsRedirect(enable: boolean): Promise<Result>;
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
