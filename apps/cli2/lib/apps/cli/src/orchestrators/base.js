"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Orchestrator = void 0;
const tslib_1 = require("tslib");
const ui_1 = require("../ui");
const semver = tslib_1.__importStar(require("semver"));
class Orchestrator {
    constructor(params) {
        this.params = params;
        if (semver.lt(process.version, '13.0.0')) {
            throw Error(`Node.js version 13.0.0 or newer required (you are currently using Node.js ${process.version.toString()}).`);
        }
    }
    get UI() {
        if (this._ui)
            return this._ui;
        return this._ui = this.newUI();
    }
    newUI() {
        return new ui_1.TerminalUI(this.params);
    }
}
exports.Orchestrator = Orchestrator;
//# sourceMappingURL=base.js.map