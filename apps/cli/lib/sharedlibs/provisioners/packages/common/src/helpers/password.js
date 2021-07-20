"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.processPassword = exports.generatePassword = void 0;
const generate_password_1 = require("generate-password");
const defaultOptions = {
    strict: true,
    length: 18,
    numbers: true,
    uppercase: true,
    excludeSimilarCharacters: true
};
const generatePassword = (options = defaultOptions) => generate_password_1.generate(options);
exports.generatePassword = generatePassword;
const processPassword = (option) => option ?
    (typeof option == 'string' ? option : exports.generatePassword(option)) :
    exports.generatePassword();
exports.processPassword = processPassword;
//# sourceMappingURL=password.js.map