import { Deployment } from '@c6o/kubeclient-resources/apps/v1';
import { baseProvisionerType } from '../index';
declare module '../index' {
    interface Provisioner {
        clearAll(namespace: string, clientNamespace: string, clientApp: string): Promise<void>;
        removeJob(jobName: string): Promise<void>;
        addTlsCerts(name: any, certs: any): Promise<void>;
        removeTlsCerts(name: any): Promise<void>;
    }
}
export declare const apiMixin: (base: baseProvisionerType) => {
    new (...a: any[]): {
        runningDeployment: Deployment;
        clientApp: string;
        clientNamespace: string;
        configMap: any;
        prometheusConfig: any;
        hasConfigChanged: boolean;
        addedSecrets: any[];
        removedSecrets: any[];
        getPrometheusDeployment: (namespace: any) => Promise<import("../../../../../kubeclient/packages/contracts/src").Result>;
        clearAll(namespace: string, clientNamespace: string, clientApp: string): Promise<void>;
        beginConfig(namespace: string, clientNamespace: string, clientApp: string): Promise<void>;
        addJobs(jobs: any): Promise<void>;
        removeJob(jobName: any): Promise<void>;
        removeAllJobs(): Promise<void>;
        addTlsCerts(name: any, certs: any): Promise<void>;
        removeTlsCerts(name: any): Promise<void>;
        certSecret(name: any, namespace: any): {
            kind: string;
            metadata: {
                name: any;
                namespace: any;
                labels: {
                    name: string;
                };
            };
            type: string;
        };
        endConfig(): Promise<void>;
        prometheusNamespace: string;
        jobConfig: any;
        removeJobName: any;
        certName: any;
        certFiles: any;
        simpleServiceProvided(answers: any): boolean;
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
    };
};
