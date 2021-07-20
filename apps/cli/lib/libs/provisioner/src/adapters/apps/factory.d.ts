import { Status } from '@c6o/kubeclient-contracts';
export declare class ProvisionerFactory {
    status: Status;
    private _pluginManager;
    private get pluginManager();
    createProvisioner: (npmPackage: any) => Promise<any>;
    getRegistryProvisioner: (module: string) => Promise<{
        module: any;
        location: string;
    }>;
    getLocalProvisioner: (npmPackage: string) => Promise<{
        module: any;
        location: string;
    }>;
}
