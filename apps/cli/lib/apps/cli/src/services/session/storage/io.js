"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensureOwner = void 0;
const tslib_1 = require("tslib");
const fs_1 = require("fs");
const ensureOwner = (path) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    if (process.getuid() === 0) {
        if (process.env.SUDO_UID && process.env.SUDO_GID) {
            const uid = parseInt(process.env.SUDO_UID);
            const gid = parseInt(process.env.SUDO_GID);
            yield fs_1.promises.chown(path, uid, gid);
        }
    }
});
exports.ensureOwner = ensureOwner;
//# sourceMappingURL=io.js.map