"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Persistence = void 0;
const tslib_1 = require("tslib");
const mixwith_1 = require("mixwith");
const contracts_1 = require("@provisioner/contracts");
const client_1 = require("@c6o/kubeclient/client");
const address_1 = require("./address");
const errors_1 = require("./errors");
const attach_1 = require("./implementation/attach");
const delete_1 = require("./implementation/delete");
const detach_1 = require("./implementation/detach");
const expand_1 = require("./implementation/expand");
const patch_1 = require("./implementation/patch");
const snapshot_1 = require("./implementation/snapshot");
const worker_threads_1 = require("worker_threads");
const path_1 = tslib_1.__importDefault(require("path"));
const logger_1 = require("@c6o/logger");
const debug = logger_1.createDebug();
class Persistence extends mixwith_1.mix(Object).with(attach_1.attachMixin, delete_1.deleteMixin, detach_1.detachMixin, expand_1.expandMixin, patch_1.patchMixin, snapshot_1.snapshotMixin) {
    constructor() {
        super();
        this.cluster = new client_1.Cluster();
    }
    attach(request) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.attachDestructiveImplementation(request);
        });
    }
    detach(request) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.runWorker('./implementation/provisioning/detach.js', request);
        });
    }
    delete(request) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.deleteImplementation(request);
        });
    }
    list(request) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const result = request.metadata.name ?
                yield this.cluster.read(request) :
                yield this.cluster.list(request);
            result.throwIfError();
            return result;
        });
    }
    expand(request) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.expandImplementation(request);
        });
    }
    expansionAllowed(request) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.expansionAllowedImplementation(request);
        });
    }
    patch(request) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.patchImplementation(request);
        });
    }
    snapshot(request) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.snapshotImplementation(request);
        });
    }
    snapshotAllowed() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.snapshotAllowedImplementation();
        });
    }
    copy(persisentvolumeClaimName, namespace, appId, targetVolumeName) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            throw new errors_1.PersistenceHelperError('Method not implemented.');
        });
    }
    restore(volumeSnapshotName, namespace, appId, persisentvolumeClaimName) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            throw new errors_1.PersistenceHelperError('Method not implemented.');
        });
    }
    runWorker(workerFile, options) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            debug('Calling: ', workerFile, options);
            const worker = new worker_threads_1.Worker(path_1.default.resolve(__dirname, workerFile), { workerData: options });
            worker.on('message', (message) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                debug('worker message', message);
            }));
            worker.on('exit', (code) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                debug('worker complete', code);
            }));
            worker.on('error', (...args) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                debug('worker error', args);
            }));
            return;
        });
    }
    getResource(name, kind, namespace, apiVersion) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const address = address_1.PersistenceAddress.toAddress(name, kind, namespace, apiVersion);
            const result = yield this.cluster.read(address);
            result.throwIfError();
            return result.object;
        });
    }
    getDeployment(namespace, appName) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const deploymentAddress = address_1.PersistenceAddress.toDeploymentAddress(namespace, appName);
            const deploymentResult = yield this.cluster.read(deploymentAddress);
            deploymentResult.throwIfError();
            return new contracts_1.DeploymentHelper(deploymentResult.as());
        });
    }
    getPersistentVolume(volumeName) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const pvAddress = address_1.PersistenceAddress.toPersisentVolumeAddress(volumeName);
            const pvResult = yield this.cluster.read(pvAddress);
            pvResult.throwIfError();
            return pvResult.object;
        });
    }
    getPersistentVolumeClaim(namespace, persistentVolumeClaimName) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const pvcAddress = address_1.PersistenceAddress.toPersisentVolumeClaimAddress(namespace, persistentVolumeClaimName);
            const pvcResult = yield this.cluster.read(pvcAddress);
            pvcResult.throwIfError();
            return pvcResult.object;
        });
    }
    getPersistentVolumeClaimFromMountPath(namespace, appName, mountPath) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const app = yield this.getApplication(namespace, appName);
            const volumeMount = app.spec.provisioner.volumes.find(volume => volume.mountPath === mountPath);
            const pvcAddress = address_1.PersistenceAddress.toPersisentVolumeClaimAddress(namespace, volumeMount.name);
            const pvcResult = yield this.cluster.read(pvcAddress);
            pvcResult.throwIfError();
            return pvcResult.object;
        });
    }
    getApplication(namespace, appName) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const appAddress = address_1.PersistenceAddress.toAppAddress(namespace, appName);
            const appResult = yield this.cluster.read(appAddress);
            appResult.throwIfError();
            return new contracts_1.AppHelper(appResult.object);
        });
    }
}
exports.Persistence = Persistence;
//# sourceMappingURL=helper.js.map