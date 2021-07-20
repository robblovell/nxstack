import { baseProvisionerType } from '../index';
export declare const createApplyMixin: (base: baseProvisionerType) => {
    new (...a: any[]): {
        createApply(): Promise<void>;
        readonly prometheusPods: {
            kind: string;
            metadata: {
                namespace: string;
                labels: {
                    name: string;
                };
            };
        };
        installPrometheusComponents(): Promise<void>;
        ensurePrometheusIsRunning(): Promise<void>;
        prometheusNamespace: string;
        jobConfig: any;
        removeJobName: any;
        certName: any;
        certFiles: any;
        simpleServiceProvided(answers: any): boolean;
        clearAll: ((namespace: string, clientNamespace: string, clientApp: string) => Promise<void>) & ((namespace: string, clientNamespace: string, clientApp: string) => Promise<void>);
        removeJob(jobName: string): Promise<void>;
        addTlsCerts(name: any, certs: any): Promise<void>;
        removeTlsCerts(name: any): Promise<void>;
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
        beginConfig(namespace: string, clientNamespace: string, clientApp: string): Promise<void>;
        addJobs(jobs: any[]): Promise<void>;
        endConfig(): Promise<void>;
    };
};
