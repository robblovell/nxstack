import { Result, Resource } from '@c6o/kubeclient-contracts';
import { AppResource, RoutesType } from '@provisioner/contracts';
import { baseProvisionerType } from '../../index';
export declare const virtualServiceApiMixin: (base: baseProvisionerType) => {
    new (...a: any[]): {
        app: AppResource;
        upsertVirtualService(app: AppResource, gateway: string): Promise<Result>;
        removeVirtualService(app: AppResource): Promise<void>;
        simpleTcpSection: (route: RoutesType) => any;
        getApplicationPrefix(appName: string, namespace: string): string;
        simpleHttpSection: (route: RoutesType) => any;
        virtualService: (app: AppResource, gateway: string) => {
            apiVersion: string;
            kind: string;
            metadata: {
                name: string;
                namespace: string;
                labels: {
                    [x: string]: string;
                };
            };
            spec: {
                hosts: string[];
                gateways: string[];
                http: any[];
                tcp: any[];
            };
        };
        getTcpPortNumber(route: RoutesType): number;
        setTcpPortNumber(route: RoutesType, port: number): void;
        getTcpPortName(route: RoutesType): string;
        gatewayTcpPortTemplate: (route: RoutesType) => {
            hosts: string[];
            port: {
                name: string;
                protocol: string;
                number: number;
            };
        };
        getGateway(): Promise<Resource>;
        getLoadBalancer(): Promise<Resource>;
        generateUsablePortNumber(): number;
        checkPortConflict(route: RoutesType): Promise<void>;
        addTcpPortGateway(route: RoutesType): Promise<Result>;
        removeTcpPortGateway(route: RoutesType): Promise<Result>;
        loadBalancer: {
            apiVersion: string;
            kind: string;
            metadata: {
                name: string;
                namespace: string;
            };
        };
        loadBalancerTcpPortTemplate: (route: RoutesType) => {
            name: string;
            protocol: string;
            port: number;
            targetPort: number;
        };
        addTcpPortLoadBalancer(route: RoutesType): Promise<Result>;
        removeTcpPortLoadBalancer(route: RoutesType): Promise<Result>;
        linkGrafana(grafanaNamespace: string, serviceNamespace: string): Promise<void>;
        unlinkGrafana(serviceNamespace: string, clearLinkField?: boolean): Promise<void>;
        gateway: Resource;
        linkPrometheus(prometheusNamespace: string, istioNamespace: string): Promise<void>;
        unlinkPrometheus(istioNamespace: string, clearLinkField?: boolean): Promise<void>;
        createGateway(namespace: string, name: string, servers?: any): Promise<Result>;
        removeGateway(namespace: string, name: string): Promise<Result>;
        getExternalAddress(): Promise<import("@provisioner/contracts").IngressParameters>;
        setHttpsRedirect(enable: boolean): Promise<Result>;
        controller: import("@provisioner/contracts").Controller;
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
