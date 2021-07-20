"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SecretHelper = void 0;
const contracts_1 = require("@provisioner/contracts");
class SecretHelper extends contracts_1.SecretHelper {
    static toKeyValues(secrets) {
        if (!secrets.data)
            return {};
        const data = {};
        Object.keys(secrets.data).forEach(key => data[key] = Buffer.from(secrets.data[key], 'base64'));
        return data;
    }
}
exports.SecretHelper = SecretHelper;
SecretHelper.from = (namespace, name) => new SecretHelper(SecretHelper.template(namespace, name));
//# sourceMappingURL=secret.js.map