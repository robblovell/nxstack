import { flags } from '@oclif/command';
export declare const kubeconfigFlag: (opts?: any) => {
    kubeconfig: flags.IOptionFlag<string[]>;
};
export declare const namespaceFlag: (opts?: any) => {
    namespace: flags.IOptionFlag<string[]>;
};
export declare const sessionFlags: (cleanOpts?: any, backgroundOpts?: any) => {
    clean: import("@oclif/parser/lib/flags").IBooleanFlag<boolean>;
    wait: import("@oclif/parser/lib/flags").IBooleanFlag<boolean>;
};
