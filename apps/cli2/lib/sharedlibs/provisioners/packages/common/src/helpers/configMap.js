"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigMapHelper = void 0;
const contracts_1 = require("@provisioner/contracts");
class ConfigMapHelper extends contracts_1.ConfigMapHelper {
    static toKeyValues(configMap) {
        if (!configMap.data)
            return {};
        return Object.assign({}, configMap.data);
    }
}
exports.ConfigMapHelper = ConfigMapHelper;
ConfigMapHelper.from = (namespace, name) => new ConfigMapHelper(ConfigMapHelper.template(namespace, name));
//# sourceMappingURL=configMap.js.map