"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Init = void 0;
const tslib_1 = require("tslib");
const base_1 = require("../base");
const kubefwd_1 = require("@c6o/kubefwd");
class Init extends base_1.Service {
    execute() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield this.wrapStatus('Initializing CodeZero', () => tslib_1.__awaiter(this, void 0, void 0, function* () {
                yield this.initKubefwd();
            }));
        });
    }
    initKubefwd() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield this.wrapStatus('Configuring teleport service and permissions', () => tslib_1.__awaiter(this, void 0, void 0, function* () {
                if (this.params.dryRun) {
                }
                else {
                    yield kubefwd_1.installKubefwd();
                }
            }));
        });
    }
}
exports.Init = Init;
//# sourceMappingURL=service.js.map