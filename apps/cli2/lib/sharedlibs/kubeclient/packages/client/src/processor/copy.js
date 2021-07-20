"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.copyMixin = void 0;
const tslib_1 = require("tslib");
const tarfs = tslib_1.__importStar(require("tar-fs"));
const tarstream = tslib_1.__importStar(require("tar-stream"));
const fs = tslib_1.__importStar(require("fs"));
const path = tslib_1.__importStar(require("path"));
const os_1 = require("os");
const copyMixin = (base) => class ifMixinImp extends base {
    copy(document, src, dst) {
        const srcPath = path.resolve(this.resolveTilde(src));
        const stats = fs.lstatSync(srcPath);
        if (stats.isDirectory()) {
            const tar = tarfs.pack(srcPath);
            return this.exec(document, ['tar', '-xmf', '-', '-C', dst], null, null, tar);
        }
        else {
            const dstParsed = path.parse(dst);
            const dstFolder = dstParsed.dir;
            const dstFile = dstParsed.base;
            const buffer = fs.readFileSync(srcPath);
            const packer = tarstream.pack();
            packer.entry({ name: dstFile, size: buffer.length }, buffer);
            return this.exec(document, ['tar', '-xmf', '-', '-C', dstFolder], null, null, packer);
        }
    }
    resolveTilde(filePath) {
        if (!filePath || typeof (filePath) !== 'string')
            return '';
        if (filePath[0] === '~' && (filePath[1] === '/' || filePath.length === 1))
            return filePath.replace('~', os_1.homedir());
        return filePath;
    }
};
exports.copyMixin = copyMixin;
//# sourceMappingURL=copy.js.map