export declare class TestUtils {
    static render(tag: any, attributes?: {}): Promise<unknown>;
    static _renderToDocument(tag: any, attributes: any): void;
    static _mapObjectToHTMLAttributes(attributes: any): string;
    static _waitForComponentToRender(tag: any): Promise<unknown>;
}
