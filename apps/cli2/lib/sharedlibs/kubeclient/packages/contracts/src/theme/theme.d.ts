import { RendererEvent } from 'typedoc/dist/lib/output/events';
import { TemplateMapping } from 'typedoc/dist/lib/output/themes/DefaultTheme';
import { DeclarationReflection, Renderer, UrlMapping } from 'typedoc';
import MarkdownTheme from 'typedoc-plugin-markdown/dist/theme';
export default class CodeZeroTheme extends MarkdownTheme {
    constructor(renderer: Renderer, basePath: string);
    writeSummary(renderer: RendererEvent): void;
    getSummaryMarkdown(renderer: RendererEvent, prefix?: string): string;
    allowedDirectoryListings(): string[];
    badModule: any;
    buildUrls(reflection: DeclarationReflection, urls: UrlMapping[]): UrlMapping[];
    static getMapping(reflection: DeclarationReflection): TemplateMapping | undefined;
    static MAPPINGS: TemplateMapping[];
}
