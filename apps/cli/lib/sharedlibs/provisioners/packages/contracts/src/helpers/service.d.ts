import { ResourceHelper } from '@c6o/kubeclient-contracts';
import { Service } from '@c6o/kubeclient-resources/core/v1';
export declare class ServiceHelper<T extends Service = Service> extends ResourceHelper<T> {
    static template: (namespace?: string, name?: string) => Service;
    static from: (namespace?: string, name?: string) => ServiceHelper<Service>;
}
