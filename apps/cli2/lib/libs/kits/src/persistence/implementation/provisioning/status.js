"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServerStatus = exports.statusFactory = void 0;
const kubeclient_contracts_1 = require("@c6o/kubeclient-contracts");
const statusFactory = (parentPort) => () => (manager, resource) => new ServerStatus(parentPort, manager, resource);
exports.statusFactory = statusFactory;
class ServerStatus extends kubeclient_contracts_1.Status {
    constructor(parentPort, manager, resource) {
        super();
        this.parentPort = parentPort;
        this.manager = manager;
        this.resource = resource;
        this.manager.on('load', () => {
            this.document = {
                apiVersion: this.resource.apiVersion,
                kind: this.resource.kind,
                metadata: {
                    name: this.resource.metadata.name,
                    namespace: this.resource.metadata.namespace,
                    resourceVersion: this.resource.metadata.resourceVersion
                }
            };
        });
        this.manager.on('done', () => { var _a; return (_a = this.parentPort) === null || _a === void 0 ? void 0 : _a.postMessage({ document: this.resource, done: true }); });
    }
    mutated(...items) {
        super.mutated();
        if (this.parentPort) {
            this.parentPort.postMessage({ document: this.resource, items });
        }
    }
}
exports.ServerStatus = ServerStatus;
//# sourceMappingURL=status.js.map