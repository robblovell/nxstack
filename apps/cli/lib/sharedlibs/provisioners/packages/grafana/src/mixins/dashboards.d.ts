import { ConfigMap } from '@c6o/kubeclient-resources/core/v1';
import { Deployment } from '@c6o/kubeclient-resources/apps/v1';
import { baseProvisionerType } from '../index';
export declare const dashboardApiMixin: (base: baseProvisionerType) => {
    new (...a: any[]): {
        appNamespace: any;
        appName: any;
        runningDeployment: Deployment;
        addConfigMaps: any[];
        removeConfigMaps: any[];
        datasources: any[];
        removeDatasources: any[];
        apiConfigMapAppMetadata: (appNamespace: string, appName: string) => {
            'system.codezero.io/app-name': string;
            'system.codezero.io/app-namespace': string;
        };
        apiDashboardConfigMap(dashboardName: string, dashboardSpec?: string): any;
        mainConfigMap(namespace: any): {
            kind: string;
            metadata: {
                namespace: any;
                name: string;
            };
        };
        clearConfig(namespace: string, appNamespace: string, appName: string): Promise<void>;
        removeFoldersDataSources(namespace: string, appNamespace: any, appName: any): Promise<void>;
        removeVolumeMounts(appNamespace: any, appName: any): Promise<void>;
        getGrafanaDeployment: (namespace: any) => Promise<import("../../../../../kubeclient/packages/contracts/src").Result>;
        beginConfig(namespace: string, appNamespace: string, appName: string): Promise<void>;
        updateConfig(): Promise<boolean>;
        addDataSource(name: any, spec: any): Promise<string>;
        removeDataSource(name: string): Promise<void>;
        addDashboard(dashboardName: string, dashBoardSpec: string): Promise<void>;
        removeDashboard(dashboardName: string): Promise<void>;
        endConfig(): Promise<void>;
        restartGrafana(): Promise<void>;
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
        dashboardConfigMap(namespace: string): ConfigMap;
    };
};
