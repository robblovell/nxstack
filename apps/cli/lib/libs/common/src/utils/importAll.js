"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.importAll = void 0;
const tslib_1 = require("tslib");
const fs_1 = require("fs");
function importAll(folder) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const commands = [];
        fs_1.readdirSync(folder).forEach(file => {
            if (file.endsWith('.js'))
                commands.push(Promise.resolve().then(() => tslib_1.__importStar(require(folder + file))));
        });
        return Promise.all(commands);
    });
}
exports.importAll = importAll;
//# sourceMappingURL=importAll.js.map