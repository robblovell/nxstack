import { baseProvisionerType } from '../index';
export declare const createApplyMixin: (base: baseProvisionerType) => {
    new (...a: any[]): {
        readonly crdDocument: {
            apiVersion: string;
            kind: string;
            metadata: {
                namespace: string;
                labels: {
                    release: string;
                };
            };
        };
        readonly ingressPod: {
            kind: string;
            metadata: {
                namespace: string;
                labels: {
                    istio: string;
                };
            };
        };
        readonly istiodPod: {
            kind: string;
            metadata: {
                namespace: string;
                labels: {
                    istio: string;
                };
            };
        };
        readonly expectedTlsCertificate: {
            apiVersion: string;
            kind: string;
            type: string;
            metadata: {
                name: string;
                namespace: string;
            };
        };
        createApply(): Promise<void>;
        installCrds(): Promise<void>;
        installIstioServices(): Promise<void>;
        ensureCrdsApplied(): Promise<void>;
        countCRDs(_: any, attempt: any): Promise<boolean>;
        ensureIngressIsRunning(): Promise<void>;
        ensureIstiodIsRunning(): Promise<void>;
        linkGrafana(grafanaNamespace: string, serviceNamespace: string): Promise<void>;
        unlinkGrafana(serviceNamespace: string, clearLinkField?: boolean): Promise<void>;
        gateway: import("../../../../../kubeclient/packages/contracts/src").Resource;
        linkPrometheus(prometheusNamespace: string, istioNamespace: string): Promise<void>;
        unlinkPrometheus(istioNamespace: string, clearLinkField?: boolean): Promise<void>;
        upsertVirtualService(app: import("../../../contracts/src").AppResource, gateway: string): Promise<import("../../../../../kubeclient/packages/contracts/src").Result>;
        removeVirtualService(app: import("../../../contracts/src").AppResource): Promise<void>;
        getApplicationPrefix(appName: string, namespace: string): string;
        createGateway(namespace: string, name: string, servers?: any): Promise<import("../../../../../kubeclient/packages/contracts/src").Result>;
        removeGateway(namespace: string, name: string): Promise<import("../../../../../kubeclient/packages/contracts/src").Result>;
        getExternalAddress(): Promise<import("../../../contracts/src").IngressParameters>;
        setHttpsRedirect(enable: boolean): Promise<import("../../../../../kubeclient/packages/contracts/src").Result>;
        controller: import("../../../contracts/src").Controller;
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
