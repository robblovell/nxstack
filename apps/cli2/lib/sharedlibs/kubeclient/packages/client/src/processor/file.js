"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyMixin = void 0;
const tslib_1 = require("tslib");
const kubeclient_contracts_1 = require("@c6o/kubeclient-contracts");
const fs_1 = tslib_1.__importDefault(require("fs"));
const path = tslib_1.__importStar(require("path"));
const callsite_1 = tslib_1.__importDefault(require("callsite"));
const yaml = tslib_1.__importStar(require("js-yaml"));
const Handlebars = tslib_1.__importStar(require("handlebars"));
const applyMixin = (base) => class applyMixinImp extends base {
    getRequestDir() {
        const stack = callsite_1.default();
        return path.dirname(stack[3].getFileName());
    }
    resolve(requestDir, file) {
        var _a;
        const index = file.indexOf('{version}');
        if (~index) {
            let minor = this.cluster.info.data.minor + 2;
            do {
                const trying = path.resolve(requestDir, file.replace('{version}', `${this.cluster.info.data.major}.${this.cluster.info.data.minor}`));
                if (fs_1.default.existsSync(trying)) {
                    (_a = this.cluster.status) === null || _a === void 0 ? void 0 : _a.info(`Using version ${minor} spec for cluster version ${this.cluster.info.data.minor}`);
                    return trying;
                }
                --minor;
            } while (minor > 13);
            const base = path.resolve(requestDir, file.replace('{version}/', ''));
            if (fs_1.default.existsSync(base))
                return base;
            throw new Error(`Unable to resolve ${file}`);
        }
        return path.resolve(requestDir, file);
    }
    loadYaml(requestDir, file, params) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            file = this.resolve(requestDir, file);
            const source = fs_1.default.readFileSync(file, 'utf8');
            if (!params)
                return yaml.loadAll(source);
            const template = Handlebars.compile(source, { noEscape: true });
            const content = template(params);
            return yaml.loadAll(content);
        });
    }
    *_yamlFileIterator(documents) {
        for (const document of documents) {
            if (document !== null) {
                if (document.kind === 'List')
                    for (const item of document.items)
                        yield item;
                else
                    yield document;
            }
        }
    }
    eachFile(fn, file, params, ...fnArgs) {
        const requestDir = this.getRequestDir();
        this.do(() => tslib_1.__awaiter(this, void 0, void 0, function* () { return kubeclient_contracts_1.Result.from(this.loadYaml(requestDir, file, params)); }))
            .do((result) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const documents = result.other;
            for (const document of this._yamlFileIterator(documents))
                yield fn.call(this, document, fnArgs);
        }));
        return this;
    }
    upsertFile(file, params) {
        var _a;
        return this.eachFile(this.upsert, file, params, (_a = this.owners) === null || _a === void 0 ? void 0 : _a.slice());
    }
    createFile(file, params) {
        var _a;
        return this.eachFile(this.create, file, params, (_a = this.owners) === null || _a === void 0 ? void 0 : _a.slice());
    }
    deleteFile(file, params) {
        return this.eachFile(this.delete, file, params);
    }
};
exports.applyMixin = applyMixin;
//# sourceMappingURL=file.js.map