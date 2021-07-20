"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PersistenceHelperError = void 0;
class PersistenceHelperError extends Error {
    constructor(error) {
        if (typeof (error) === 'string')
            super(error);
        else
            super(JSON.stringify(error, null, 4));
        this.name = "PersistenceHelper";
    }
}
exports.PersistenceHelperError = PersistenceHelperError;
//# sourceMappingURL=errors.js.map