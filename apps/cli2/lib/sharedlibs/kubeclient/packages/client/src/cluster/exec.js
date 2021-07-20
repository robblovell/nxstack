"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.execMixin = void 0;
const tslib_1 = require("tslib");
const client_node_1 = require("@kubernetes/client-node");
const kubeclient_contracts_1 = require("@c6o/kubeclient-contracts");
const execMixin = (base) => class extends base {
    exec(document, command, stdout, stderr, stdin) {
        var _a, _b;
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const exec = new client_node_1.Exec(this.kubeConfig);
            const namespace = (_a = document === null || document === void 0 ? void 0 : document.metadata) === null || _a === void 0 ? void 0 : _a.namespace;
            const podName = (_b = document === null || document === void 0 ? void 0 : document.metadata) === null || _b === void 0 ? void 0 : _b.name;
            const containerName = null;
            stderr = stderr || process.stderr;
            return yield kubeclient_contracts_1.Result.from(exec.exec(namespace, podName, containerName, command, stdout, stderr, stdin, false, null));
        });
    }
};
exports.execMixin = execMixin;
//# sourceMappingURL=exec.js.map