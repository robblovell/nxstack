export declare const mix: (superclass?: {
    new (): {};
}) => MixinBuilder;
declare class MixinBuilder {
    private superclass;
    constructor(superclass: any);
    with(...mixins: any[]): any;
}
export {};
