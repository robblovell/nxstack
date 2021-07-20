import { BaseNamespaceHelper } from './base';
export declare class EnvironmentNamespaceHelper extends BaseNamespaceHelper {
    get type(): string;
    get typeDisplay(): string;
    static template: (name?: string) => {
        apiVersion: string;
        kind: string;
        metadata: {
            labels: {
                'system.codezero.io/type': string;
            };
            name: string;
        };
    };
}
