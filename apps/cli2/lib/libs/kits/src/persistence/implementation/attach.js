"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.attachMixin = void 0;
const tslib_1 = require("tslib");
const contracts_1 = require("@provisioner/contracts");
const errors_1 = require("../errors");
const generators_1 = require("../generators");
const templates_1 = require("../../templates");
const attachMixin = (base) => class extends base {
    constructor() {
        super();
    }
    attachSimpleImplementation(request) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const app = yield this.getApplication(request.namespace, request.appName);
            const DeploymentHelper = yield this.getDeployment(request.namespace, request.appName);
            const deployment = DeploymentHelper.resource;
            let volume;
            if (request.mountPoint) {
                volume = app.volumes.find((volume) => volume.mountPath === request.mountPoint);
            }
            else if (request.volumeClaimName) {
                volume = app.volumes.find((volume) => volume.name === request.volumeClaimName);
            }
            else {
                throw new errors_1.PersistenceHelperError('Attach request must provide a mount point or volume claim name.');
            }
            yield this.addVolumeToDeployment(deployment, volume.name, volume.mountPath);
            return;
        });
    }
    attachDestructiveImplementation(request) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let persistentVolumeClaim;
            [persistentVolumeClaim, request] = yield this.setupAttach(request);
            const deployment = yield this.getDeployment(request.namespace, request.appName);
            if (!persistentVolumeClaim)
                yield this.createPersistentVolumeClaim(request, [deployment.resource]);
            else
                yield this.validatePersistentVolumeClaim(persistentVolumeClaim, deployment.resource);
            yield this.addPVCToDeploymentVolumes(deployment.resource, request.volumeClaimName, request.mountPoint);
            yield this.addPVCToDeploymentVolumeMounts(deployment.resource, request.volumeClaimName, request.mountPoint);
            return;
        });
    }
    addVolumeToDeployment(doc, volumeClaimName, mountPoint) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const volumeMountEntry = generators_1.PersistenceGenerator.toVolumeMountEntry(volumeClaimName, mountPoint);
            const volumeEntry = generators_1.PersistenceGenerator.toVolumeEntry(volumeClaimName);
            for (const [index, container] of doc.spec.template.spec.containers.entries()) {
                if (container.volumeMounts) {
                    const result = yield this.cluster.patch(doc, [
                        {
                            'op': 'add',
                            'path': `/spec/template/spec/volumes/-`,
                            'value': volumeEntry,
                        },
                        {
                            'op': 'add',
                            'path': `/spec/template/spec/containers/${index}/volumeMounts/-`,
                            'value': volumeMountEntry,
                        },
                    ]);
                    if (result.error) {
                        throw new errors_1.PersistenceHelperError(result);
                    }
                }
                else {
                    const result = yield this.cluster.patch(doc, [
                        {
                            'op': 'add',
                            'path': `/spec/template/spec/volumes`,
                            'value': [volumeEntry],
                        },
                        {
                            'op': 'add',
                            'path': `/spec/template/spec/containers/${index}/volumeMounts`,
                            'value': [volumeMountEntry],
                        },
                    ]);
                    if (result.error) {
                        throw new errors_1.PersistenceHelperError(result);
                    }
                }
            }
            return;
        });
    }
    addPVCToDeploymentVolumeMounts(doc, volumeClaimName, mountPoint) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const volumeMountEntry = generators_1.PersistenceGenerator.toVolumeMountEntry(volumeClaimName, mountPoint);
            for (const [index, container] of doc.spec.template.spec.containers.entries()) {
                if (container.volumeMounts) {
                    const result = yield this.cluster.patch(doc, [
                        {
                            'op': 'add',
                            'path': `/spec/template/spec/containers/${index}/volumeMounts/-`,
                            'value': volumeMountEntry,
                        }
                    ]);
                    if (result.error) {
                        throw new errors_1.PersistenceHelperError(result);
                    }
                }
                else {
                    const result = yield this.cluster.patch(doc, [
                        {
                            'op': 'add',
                            'path': `/spec/template/spec/containers/${index}/volumeMounts`,
                            'value': [volumeMountEntry],
                        }
                    ]);
                    if (result.error) {
                        throw new errors_1.PersistenceHelperError(result);
                    }
                }
            }
            return;
        });
    }
    addPVCToDeploymentVolumes(doc, volumeClaimName, mountPoint) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const volumeEntry = generators_1.PersistenceGenerator.toVolumeEntry(volumeClaimName);
            if (doc.spec.template.spec.volumes) {
                const result = yield this.cluster.patch(doc, [
                    {
                        'op': 'add',
                        'path': `/spec/template/spec/volumes/-`,
                        'value': volumeEntry,
                    }
                ]);
                if (result.error)
                    throw new errors_1.PersistenceHelperError(result.error);
            }
            else {
                const result = yield this.cluster.patch(doc, [
                    {
                        'op': 'add',
                        'path': `/spec/template/spec/volumes`,
                        'value': [volumeEntry],
                    }
                ]);
                if (result.error)
                    throw new errors_1.PersistenceHelperError(result.error);
            }
            return;
        });
    }
    getPersistentVolumeClaimAndSetupAttach(request) {
        var _a, _b, _c, _d;
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (!request.mountPoint)
                throw new errors_1.PersistenceHelperError('When attaching to an existing persistent volume claim, a mount point must be given.');
            const persistentVolumeClaim = yield this.getPersistentVolumeClaim(request.namespace, request.volumeClaimName);
            request.volumeName = (_a = persistentVolumeClaim.spec) === null || _a === void 0 ? void 0 : _a.volumeName;
            request.volumeSize = (_d = (_c = (_b = persistentVolumeClaim.spec) === null || _b === void 0 ? void 0 : _b.resources) === null || _c === void 0 ? void 0 : _c.requests) === null || _d === void 0 ? void 0 : _d.storage;
            return [persistentVolumeClaim, request];
        });
    }
    getVolumeSnapshotAndSetupAttach(request) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            throw new errors_1.PersistenceHelperError('Attach to snapshot not implemented.');
        });
    }
    getPersistentVolumeAndSetupAttach(request) {
        var _a, _b, _c;
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (!request.mountPoint)
                throw new errors_1.PersistenceHelperError('When attaching to an existing persistent volume, a mount point must be given.');
            try {
                const persistentVolume = yield this.getPersistentVolume(request.volumeName);
                request.volumeName = (_a = persistentVolume.metadata) === null || _a === void 0 ? void 0 : _a.name;
                request.volumeSize = (_c = (_b = persistentVolume.spec) === null || _b === void 0 ? void 0 : _b.capacity) === null || _c === void 0 ? void 0 : _c.storage;
                request.volumeClaimName = request.appName + '-' + request.mountPoint.substring(1).toLowerCase();
                return request;
            }
            catch (_d) {
                throw new errors_1.PersistenceHelperError('No persistent volume was found, did you specify one?');
            }
        });
    }
    getAppAndSetupAttach(request) {
        var _a, _b;
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const appObject = yield this.getApplication(request.namespace, request.appName);
            const app = appObject.resource;
            if (((_a = app.spec.provisioner.volumes) === null || _a === void 0 ? void 0 : _a.length) === 0) {
                throw new errors_1.PersistenceHelperError('If the application has more than one volume, ' +
                    'mount point or a volume claim name must be given when only an app is given.');
            }
            let volumeClaim;
            if (((_b = app.spec.provisioner.volumes) === null || _b === void 0 ? void 0 : _b.length) === 1) {
                volumeClaim = app.spec.provisioner.volumes[0];
            }
            else {
                volumeClaim = app.spec.provisioner.volumes.find((volume) => volume.mountPath == request.mountPoint);
                if (!volumeClaim) {
                    volumeClaim = app.spec.provisioner.volumes.find((volume) => volume.name == request.volumeClaimName);
                }
            }
            if (!volumeClaim) {
                throw new errors_1.PersistenceHelperError('If the application has more than one volume, a mount point or ' +
                    'a volume claim name must be given when only an app is given.');
            }
            request.mountPoint = volumeClaim.mountPath;
            request.volumeClaimName = volumeClaim.name;
            request.volumeSize = volumeClaim.size;
            try {
                const persistentVolumeClaim = yield this.getPersistentVolumeClaim(request.namespace, request.volumeClaimName);
                return [persistentVolumeClaim, request];
            }
            catch (_c) {
                return [undefined, request];
            }
        });
    }
    validatePersistentVolumeClaim(persistentVolumeClaim, deployment) {
        var _a;
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const deploymentAppOwnerReference = deployment.metadata.ownerReferences.find(item => item.kind === 'App');
            if (!deploymentAppOwnerReference)
                throw new errors_1.PersistenceHelperError('No deployment found for this application, is it installed properly?');
            if (deploymentAppOwnerReference && ((_a = persistentVolumeClaim.metadata.ownerReferences) === null || _a === void 0 ? void 0 : _a.some((reference) => (reference.name !== deploymentAppOwnerReference.name || reference.kind !== deploymentAppOwnerReference.kind)))) {
                throw new errors_1.PersistenceHelperError('Existing persistent volume is owned by another deployment.');
            }
            if (!persistentVolumeClaim.metadata.ownerReferences)
                yield this.addOwnerReferenceToVolumeClaim(persistentVolumeClaim, deployment);
        });
    }
    addOwnerReferenceToVolumeClaim(persistentVolumeClaim, deployment) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const result = yield this.cluster.patch(persistentVolumeClaim, [
                {
                    'op': 'add',
                    'path': `/metadata/ownerReferences`,
                    'value': deployment.metadata.ownerReferences,
                }
            ]);
            if (result.error)
                throw new errors_1.PersistenceHelperError(result.error);
        });
    }
    setupAttach(request) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let persistentVolumeClaim;
            if (request.volumeClaimName) {
                [persistentVolumeClaim, request] = yield this.getPersistentVolumeClaimAndSetupAttach(request);
            }
            else if (request.volumeName) {
                request = yield this.getPersistentVolumeAndSetupAttach(request);
            }
            else if (request.volumeSnapshotName) {
                [persistentVolumeClaim, request] = yield this.getVolumeSnapshotAndSetupAttach(request);
            }
            else if (request.appName) {
                [persistentVolumeClaim, request] = yield this.getAppAndSetupAttach(request);
            }
            else {
                throw new errors_1.PersistenceHelperError('An app, persistent volume, volume claim or snapshot name must be given.');
            }
            return [persistentVolumeClaim, request];
        });
    }
    createPersistentVolumeClaim(request, owners) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const appResult = yield this.getApplication(request.namespace, request.appName);
            const app = new contracts_1.AppHelper(appResult.document);
            const persistentVolumeClaim = templates_1.generatePersistentVolumeClaim(app, {
                name: request.volumeClaimName,
                size: request.volumeSize,
                mountPath: request.mountPoint,
            }, request.namespace);
            if (persistentVolumeClaim && request.volumeName)
                persistentVolumeClaim.spec.volumeName = request.volumeName;
            const result = yield this.cluster.create(persistentVolumeClaim, owners);
            if (result.error)
                throw new errors_1.PersistenceHelperError(result.error);
        });
    }
};
exports.attachMixin = attachMixin;
//# sourceMappingURL=attach.js.map