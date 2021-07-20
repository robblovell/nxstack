"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const fs = tslib_1.__importStar(require("fs-extra"));
const events_1 = require("typedoc/dist/lib/output/events");
const typedoc_1 = require("typedoc");
const theme_1 = tslib_1.__importDefault(require("typedoc-plugin-markdown/dist/theme"));
class CodeZeroTheme extends theme_1.default {
    constructor(renderer, basePath) {
        super(renderer, basePath);
        this.listenTo(renderer, events_1.RendererEvent.END, this.writeSummary, 1024);
    }
    writeSummary(renderer) {
        const outputDirectory = renderer.outputDirectory;
        const summaryMarkdown = this.getSummaryMarkdown(renderer);
        const sidebarMarkdown = this.getSummaryMarkdown(renderer, '/kubeclient/');
        try {
            fs.writeFileSync(`${outputDirectory}/index.md`, summaryMarkdown);
            fs.writeFileSync(`${outputDirectory}/sidebar.md`, sidebarMarkdown);
            this.application.logger.write(`[typedoc-plugin-markdown] index.md written to ${outputDirectory}`);
        }
        catch (e) {
            this.application.logger.write(`[typedoc-plugin-markdown] failed to write index at ${outputDirectory}`);
        }
    }
    getSummaryMarkdown(renderer, prefix = '') {
        const md = [];
        const children = [];
        this.getNavigation(renderer.project).children.forEach(rootNavigation => {
            if (rootNavigation.children)
                children.push(...rootNavigation.children);
        });
        const sorted = children.sort((a, b) => a.title < b.title ? -1 : 1);
        children.forEach(item => {
            if (item.title)
                md.push(`- [${item.title}](${prefix}${item.url})`);
        });
        return md.join('\n');
    }
    allowedDirectoryListings() {
        return ['globals.md', 'classes', 'enums', 'interfaces', 'modules', 'media', '.DS_Store', 'index.md'];
    }
    buildUrls(reflection, urls) {
        var _a;
        if (reflection.name === '\"\"')
            this.badModule = reflection;
        if (reflection.parent === this.badModule)
            reflection.parent = this.badModule.parent;
        if (reflection.kind === typedoc_1.ReflectionKind.Interface)
            reflection.kind = typedoc_1.ReflectionKind.Class;
        if ((_a = reflection.typeHierarchy) === null || _a === void 0 ? void 0 : _a.types.length)
            reflection.typeHierarchy.types = [];
        const mapping = CodeZeroTheme.getMapping(reflection);
        if (mapping) {
            if (!reflection.url || !theme_1.default.URL_PREFIX.test(reflection.url)) {
                const url = this.toUrl(mapping, reflection);
                urls.push(new typedoc_1.UrlMapping(url, reflection, mapping.template));
                reflection.url = url;
                reflection.hasOwnDocument = true;
            }
            for (const child of reflection.children || []) {
                if (mapping.isLeaf) {
                    this.applyAnchorUrl(child, reflection);
                }
                else {
                    this.buildUrls(child, urls);
                }
            }
        }
        else if (reflection.parent) {
            this.applyAnchorUrl(reflection, reflection.parent);
        }
        return urls;
    }
    static getMapping(reflection) {
        return CodeZeroTheme.MAPPINGS.find((mapping) => reflection.kindOf(mapping.kind));
    }
}
exports.default = CodeZeroTheme;
CodeZeroTheme.MAPPINGS = [
    {
        kind: [typedoc_1.ReflectionKind.Class],
        isLeaf: false,
        directory: 'classes',
        template: 'reflection.hbs',
    },
    {
        kind: [typedoc_1.ReflectionKind.Interface],
        isLeaf: false,
        directory: 'classes',
        template: 'reflection.hbs',
    },
    {
        kind: [typedoc_1.ReflectionKind.Enum],
        isLeaf: false,
        directory: 'enums',
        template: 'reflection.hbs',
    },
    {
        kind: [typedoc_1.ReflectionKind.Namespace, typedoc_1.ReflectionKind.Module],
        isLeaf: false,
        directory: 'modules',
        template: 'reflection.hbs',
    },
];
//# sourceMappingURL=theme.js.map