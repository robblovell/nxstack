"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sessionFlags = exports.namespaceFlag = exports.kubeconfigFlag = void 0;
const command_1 = require("@oclif/command");
const kubeconfigFlag = (opts) => ({
    kubeconfig: command_1.flags.string(Object.assign({ char: 'k', description: 'Path to a specific the kubeconfig file to use for cluster credentials', env: 'KUBECONFIG' }, opts))
});
exports.kubeconfigFlag = kubeconfigFlag;
const namespaceFlag = (opts) => {
    return ({
        namespace: command_1.flags.string(Object.assign({ char: 'n', description: 'Namespace for the operation' }, opts))
    });
};
exports.namespaceFlag = namespaceFlag;
const sessionFlags = (cleanOpts, backgroundOpts) => ({
    clean: command_1.flags.boolean(Object.assign({ char: 'c', description: 'Close and clean up' }, cleanOpts)),
    wait: command_1.flags.boolean(Object.assign({ char: 'w', description: 'Wait for terminate signal and then clean up' }, backgroundOpts)),
});
exports.sessionFlags = sessionFlags;
//# sourceMappingURL=flags.js.map