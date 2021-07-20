"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStatus = void 0;
const ui_1 = require("../ui");
const getStatus = (reporter, manager) => new ui_1.CLIStatus(reporter, manager);
exports.getStatus = getStatus;
//# sourceMappingURL=status.js.map