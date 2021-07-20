import { KubeConfig } from '@kubernetes/client-node';
import { watchCallback, watchDone } from '@c6o/kubeclient-contracts';
import request from 'request-promise-native';
import requestForStream from 'request';
export declare class Request {
    private kubeConfig;
    private impersonate;
    constructor(kubeConfig: KubeConfig, impersonate?: any);
    private getRequestOptions;
    get(path: string, options?: {}): Promise<any>;
    post(path: any, body: any, options?: {}): Promise<any>;
    put(path: any, body: any): Promise<any>;
    patch(path: any, body: any, _options?: any): Promise<any>;
    delete(path: any): Promise<any>;
    watch(watchEndpoint: any, opts: request.Options, callback: watchCallback, done: watchDone): Promise<requestForStream.Request>;
}
