export declare function caller(depth?: number, defaults?: {
    packagesMatch: string;
    libMatch: string;
}): {
    module: string;
    path: any;
    filename: any;
    line: any;
};
