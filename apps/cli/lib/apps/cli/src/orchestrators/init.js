"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Init = void 0;
const tslib_1 = require("tslib");
const base_1 = require("./base");
const services_1 = require("../services/");
class Init extends base_1.Orchestrator {
    apply() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            this.params = yield this.UI.prompt(this.ensureRoot());
            const init = new services_1.Init(this.params);
            yield init.execute();
        });
    }
    ensureRoot() {
        if (process.getuid() !== 0) {
            throw new Error('You need to run this command as root.\nTry: \'sudo czctl init\'');
        }
    }
}
exports.Init = Init;
//# sourceMappingURL=init.js.map