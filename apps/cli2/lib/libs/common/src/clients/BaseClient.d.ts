export declare abstract class BaseClient {
    token: any;
    tokenPromise: any;
    privateKey: any;
    privateKeyPromise: any;
    jwkId: any;
    abstract get apiURL(): string;
    private parseURL;
    init(token?: any, privateKey?: any, jwkId?: any): Promise<void>;
    isPEM: () => any;
    headers(service: any, data?: any, headers?: any): Promise<any>;
    data: (data?: any) => any;
    get(service: any, params?: any): Promise<import("axios").AxiosResponse<any>>;
    post(service: any, data?: any, options?: any): Promise<import("axios").AxiosResponse<any>>;
    put(service: any, data?: any, options?: any): Promise<import("axios").AxiosResponse<any>>;
    patch(service: any, data?: any): Promise<import("axios").AxiosResponse<any>>;
    delete(service: any): Promise<import("axios").AxiosResponse<any>>;
    toData: (res: any) => any;
    toFirst: (res: any) => any;
}
