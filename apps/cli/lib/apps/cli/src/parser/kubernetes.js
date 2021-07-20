"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KubernetesNamespacedCommand = exports.KubernetesCommand = void 0;
const base_1 = require("./base");
const flags_1 = require("./flags");
class KubernetesCommand {
}
exports.KubernetesCommand = KubernetesCommand;
KubernetesCommand.flags = Object.assign(Object.assign({}, base_1.BaseCommand.flags), flags_1.kubeconfigFlag());
KubernetesCommand.flagMaps = Object.assign({}, base_1.BaseCommand.flagMaps);
class KubernetesNamespacedCommand extends KubernetesCommand {
}
exports.KubernetesNamespacedCommand = KubernetesNamespacedCommand;
KubernetesNamespacedCommand.flags = Object.assign(Object.assign({}, KubernetesCommand.flags), flags_1.namespaceFlag());
KubernetesNamespacedCommand.flagMaps = Object.assign({}, KubernetesCommand.flagMaps);
//# sourceMappingURL=kubernetes.js.map