import { BaseClient } from './BaseClient';
export declare class EquinixClient extends BaseClient {
    token: any;
    tokenPromise: any;
    get apiURL(): string;
    headers(service: any, data?: any, headers?: any): Promise<any>;
    getCapacities: () => Promise<any[]>;
    getFacilities: () => Promise<any[]>;
    getProjects: () => Promise<any[]>;
    getSshKey: (id: string) => Promise<any>;
    getUserSshKeys: () => Promise<any[]>;
    getFacilitiesSupportingFeatures: (requiredFeatures?: string[], levels?: string[]) => Promise<any[]>;
    getAllMachineTypes: (levels?: string[]) => Promise<any[]>;
    getFacilityMachineTypes: (facilityCode: string, levels?: string[]) => Promise<any>;
}
