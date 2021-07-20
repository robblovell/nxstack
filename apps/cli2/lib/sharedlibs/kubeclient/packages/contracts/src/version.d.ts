export interface Version {
    data: any;
    eq(ver: any): boolean;
    neq(ver: any): boolean;
    gt(ver: any): boolean;
    gte(ver: any): boolean;
    lt(ver: any): boolean;
    lte(ver: any): boolean;
    compare(ver: any): number;
}
