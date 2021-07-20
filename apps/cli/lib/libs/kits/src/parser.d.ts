export interface ParseOptions {
    rootFile?: string;
    rootFolder?: string;
    folderFile?: string;
}
export declare const parseManifest: (pathToFile?: string, basePath?: string, options?: ParseOptions) => any;
export declare function getPrimaryFile(basePath: any, file: any, options?: ParseOptions): any;
export declare function read(file: any, contents: any): any;
export declare function mergeProvisionerYaml(basePath: any, primaryFile: any, env?: string): any;
export declare function resolveKeys(basePath: any, data: any): void;
