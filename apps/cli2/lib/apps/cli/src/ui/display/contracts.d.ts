export declare type DisplayClass = '' | 'highlight' | 'error' | 'warn' | 'success' | 'important';
export interface PrintOptions {
    spaceAfter?: boolean;
    spaceBefore?: boolean;
}
export interface ReporterOptions {
    quiet?: boolean;
}
export interface Reporter {
    print(message: string | string[], displayClass?: DisplayClass, options?: PrintOptions): void;
    error(message: string | string[], options?: PrintOptions): void;
    default(message: string | string[], options?: PrintOptions): void;
    highlight(message: string | string[], options?: PrintOptions): void;
    success(message: string | string[], options?: PrintOptions): void;
    warn(message: string | string[], options?: PrintOptions): void;
    banner(title: string, messages: string | string[], displayClass?: DisplayClass): void;
    url(text: string, link: string, pre?: string): void;
    table(data: Array<any>, columns: any, options?: any): void;
    newline(): void;
}
