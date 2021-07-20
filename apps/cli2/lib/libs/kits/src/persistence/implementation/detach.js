"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.detachMixin = void 0;
const tslib_1 = require("tslib");
const errors_1 = require("../errors");
const detachMixin = (base) => class extends base {
    constructor() {
        super();
    }
    detachSimpleImplementation(request) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const deployment = yield this.getDeployment(request.namespace, request.appName);
            yield this.removeVolumeFromDeployment(deployment.resource, request);
            return;
        });
    }
    detachDestructiveImplementation(request) {
        var _a;
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let pvc;
            if (request.persistentVolumeClaimName) {
                pvc = yield this.getPersistentVolumeClaim(request.namespace, request.persistentVolumeClaimName);
            }
            else {
                pvc = yield this.getPersistentVolumeClaimFromMountPath(request.namespace, request.appName, request.mountPath);
            }
            const persistentVolume = yield this.getPersistentVolume((_a = pvc.spec) === null || _a === void 0 ? void 0 : _a.volumeName);
            yield this.setVolumeToRetain(persistentVolume);
            const deployment = yield this.getDeployment(request.namespace, request.appName);
            yield this.removePVCFromDeployment(deployment.resource, request.persistentVolumeClaimName);
            yield this.deletePVC(pvc);
            return;
        });
    }
    removePVCReferenceFromPV(doc) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const result = yield this.cluster.patch(doc, [
                {
                    'op': 'remove',
                    'path': '/spec/claimRef'
                }
            ]);
            if (result.error)
                throw new errors_1.PersistenceHelperError(result.error);
        });
    }
    removeVolumeFromDeployment(doc, request) {
        var _a, _b, _c;
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const indexes = [];
            const requestReference = request.mountPath ? request.mountPath : request.persistentVolumeClaimName;
            let foundVolumeMount;
            (_c = (_b = (_a = doc.spec.template) === null || _a === void 0 ? void 0 : _a.spec) === null || _b === void 0 ? void 0 : _b.containers) === null || _c === void 0 ? void 0 : _c.forEach((container, index1) => {
                var _a;
                (_a = container.volumeMounts) === null || _a === void 0 ? void 0 : _a.forEach((volumeMount, index2) => {
                    if (volumeMount.name === request.persistentVolumeClaimName ||
                        volumeMount.mountPath === request.mountPath) {
                        foundVolumeMount = volumeMount;
                        indexes.push({ container: index1, volume: index2 });
                    }
                });
            });
            if (indexes.length) {
                indexes.reverse();
                for (const index of indexes) {
                    const result = yield this.cluster.patch(doc, [
                        {
                            'op': 'remove',
                            'path': `/spec/template/spec/containers/${index.container}/volumeMounts/${index.volume}`
                        },
                        {
                            'op': 'remove',
                            'path': `/spec/template/spec/volumes/${index.volume}`
                        }
                    ]);
                    if (result.error)
                        throw new errors_1.PersistenceHelperError(result.error);
                }
            }
            if (!foundVolumeMount)
                throw new errors_1.PersistenceHelperError(`No volume mount found for this request.${requestReference}`);
            if (!indexes.length) {
                throw new Error(`No mounted volume for request: ${requestReference} not found to detach for this application.`);
            }
            return;
        });
    }
    removePVCFromDeployment(doc, name) {
        var _a, _b, _c;
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const indexes = [];
            (_c = (_b = (_a = doc.spec.template) === null || _a === void 0 ? void 0 : _a.spec) === null || _b === void 0 ? void 0 : _b.containers) === null || _c === void 0 ? void 0 : _c.forEach((container, index1) => {
                var _a;
                (_a = container.volumeMounts) === null || _a === void 0 ? void 0 : _a.forEach((volumeMount, index2) => {
                    if (volumeMount.name === name)
                        indexes.push({ container: index1, volume: index2 });
                });
            });
            if (indexes.length) {
                indexes.reverse();
                for (const index of indexes) {
                    const result = yield this.cluster.patch(doc, [
                        {
                            'op': 'remove',
                            'path': `/spec/template/spec/containers/${index.container}/volumeMounts/${index.volume}`
                        },
                        {
                            'op': 'remove',
                            'path': `/spec/template/spec/volumes/${index.volume}`
                        }
                    ]);
                    if (result.error)
                        throw new errors_1.PersistenceHelperError(result.error);
                }
            }
            if (!indexes.length) {
                throw new Error(`No mounted volume ${name} found to detach for this application.`);
            }
            return;
        });
    }
    deletePVC(doc) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const result = yield this.cluster.delete(doc);
            if (result.error)
                throw new errors_1.PersistenceHelperError(result.error);
            return result;
        });
    }
    setVolumeToRetain(doc) {
        var _a;
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (((_a = doc.spec) === null || _a === void 0 ? void 0 : _a.persistentVolumeReclaimPolicy.toLowerCase()) !== 'retain') {
                const result = yield this.cluster.patch(doc, [
                    { 'op': 'replace', 'path': '/spec/persistentVolumeReclaimPolicy', 'value': 'Retain' }
                ]);
                if (result.error)
                    throw new errors_1.PersistenceHelperError(result.error);
            }
        });
    }
};
exports.detachMixin = detachMixin;
//# sourceMappingURL=detach.js.map