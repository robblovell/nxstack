import { baseProvisionerMixinType } from '../provisioner';
export declare const optionsMixin: (base: baseProvisionerMixinType) => {
    new (...a: any[]): {
        providedDeprovisionOption(option: any, answers?: any): boolean;
        getDeprovisionOption(option: any, defaultValue: any, answers?: any): any;
        setDeprovisionOption(option: any, value: any): void;
        controller: import("../../../contracts/src").Controller;
        spec?: any;
        serviceNamespace: string;
        serviceName: string;
        getIngressGatewayServiceClusterIp(): Promise<string>;
        readFile(...args: string[]): Promise<string>;
    };
};
