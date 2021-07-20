"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateImageTag = void 0;
const tslib_1 = require("tslib");
const pointer = tslib_1.__importStar(require("jsonpointer"));
const debug_1 = tslib_1.__importDefault(require("debug"));
const debug = debug_1.default('provisioner:c6o-system:updateSystem:');
const updateImageTag = (cluster, document, tag, path) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const result = yield cluster.list(document);
    if (result.error) {
        debug(`Failed to retrieve system ${document.kind}`, result.error);
        return;
    }
    try {
        for (const docItem of result.object.items) {
            debug(`Updating ${document.kind}`, docItem.metadata.name);
            const currentImage = pointer.get(docItem, path);
            const sansTag = currentImage.substring(0, currentImage.indexOf(':'));
            const newImage = `${sansTag}:${tag}`;
            debug(`Going from ${currentImage} to ${newImage}`);
            const op = [{ op: 'replace', path, value: newImage }];
            const patchResult = yield cluster.patch(Object.assign({ apiVersion: document.apiVersion, kind: document.kind }, docItem), op);
            if (patchResult.error)
                throw patchResult.error;
            else
                debug('Success');
        }
    }
    catch (ex) {
        debug('ERROR during update', ex);
        throw ex;
    }
});
exports.updateImageTag = updateImageTag;
//# sourceMappingURL=update.js.map