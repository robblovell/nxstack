"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveKeys = exports.mergeProvisionerYaml = exports.read = exports.getPrimaryFile = exports.parseManifest = void 0;
const tslib_1 = require("tslib");
const yaml = tslib_1.__importStar(require("js-yaml"));
const fs = tslib_1.__importStar(require("fs"));
const path = tslib_1.__importStar(require("path"));
const url = tslib_1.__importStar(require("url"));
const object_merge_advanced_1 = require("object-merge-advanced");
const serverURL = process.env.HUB_SERVER_URL || 'https://codezero.io';
const EMPTY_OBJECT = {};
const parseManifest = (pathToFile, basePath, options = {}) => {
    if (!basePath) {
        const temp = path.resolve(process.cwd(), pathToFile);
        if (fs.lstatSync(temp).isDirectory()) {
            basePath = temp;
            pathToFile = null;
        }
        else {
            basePath = path.dirname(temp);
            pathToFile = path.basename(temp);
        }
    }
    const primaryFile = getPrimaryFile(basePath, pathToFile, options);
    if (!primaryFile)
        return EMPTY_OBJECT;
    const parsed = url.parse(serverURL);
    const environment = parsed.host.split('.')[0];
    const data = mergeProvisionerYaml(basePath, primaryFile, environment);
    resolveKeys(basePath, data);
    return data;
};
exports.parseManifest = parseManifest;
function getPrimaryFile(basePath, file, options = {}) {
    let primaryFile;
    if (file) {
        primaryFile = path.resolve(basePath, file);
        if (fs.existsSync(primaryFile))
            return primaryFile;
        primaryFile = options.rootFolder ?
            path.resolve(basePath, options.rootFolder, file) :
            path.resolve(basePath, file);
        if (fs.existsSync(primaryFile))
            return primaryFile;
    }
    else {
        primaryFile = path.resolve(basePath, options.rootFile);
        if (fs.existsSync(primaryFile))
            return primaryFile;
        primaryFile = path.resolve(basePath, options.rootFolder, options.folderFile);
        if (fs.existsSync(primaryFile))
            return primaryFile;
    }
}
exports.getPrimaryFile = getPrimaryFile;
function read(file, contents) {
    if (fs.existsSync(file) && fs.lstatSync(file).isFile()) {
        const ext = path.extname(file);
        const fileContent = ext === '.yaml' || ext === '.yml' ?
            yaml.loadAll(fs.readFileSync(file, 'utf8')) :
            fs.readFileSync(file, 'utf8');
        if (contents.length) {
            return contents.map((obj, ix) => {
                if (!fileContent.length)
                    return object_merge_advanced_1.mergeAdvanced(obj, fileContent, null);
                else if (ix < fileContent.length)
                    return object_merge_advanced_1.mergeAdvanced(obj, fileContent[ix], null);
                else
                    return obj;
            });
        }
        else {
            return fileContent.length === 1 ?
                object_merge_advanced_1.mergeAdvanced(contents, fileContent[0], null) :
                object_merge_advanced_1.mergeAdvanced(contents, fileContent, null);
        }
    }
    return contents;
}
exports.read = read;
function mergeProvisionerYaml(basePath, primaryFile, env = '') {
    const ext = path.extname(primaryFile) || '.yaml';
    const filename = primaryFile.substr(0, primaryFile.length - ext.length);
    let data;
    let envFile = path.resolve(basePath, `${filename}-${env}${ext}`);
    if (!env || env == 'codezero.io')
        envFile = path.resolve(basePath, `${filename}${ext}`);
    if (envFile != primaryFile)
        data =
            read(envFile, read(primaryFile, EMPTY_OBJECT));
    else
        data = read(primaryFile, EMPTY_OBJECT);
    return data;
}
exports.mergeProvisionerYaml = mergeProvisionerYaml;
function resolveKeys(basePath, data) {
    if (Array.isArray(data) || typeof data === 'object')
        Object.keys(data).forEach(key => {
            const value = data[key];
            if (!value)
                return;
            if (typeof value === 'string') {
                const content = exports.parseManifest(value, basePath);
                if (content !== EMPTY_OBJECT)
                    data[key] = content;
            }
            if (Array.isArray(value))
                value.forEach(item => resolveKeys(basePath, item));
            if (typeof value == 'object')
                resolveKeys(basePath, value);
        });
}
exports.resolveKeys = resolveKeys;
//# sourceMappingURL=parser.js.map