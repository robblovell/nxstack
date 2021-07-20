"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InterceptDemo = void 0;
const tslib_1 = require("tslib");
const base_1 = require("./base");
const status_1 = require("../../factories/status");
class InterceptDemo extends base_1.Demo {
    demo() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            this.params.remoteService = yield this.promptResource(this.params.remoteService, [], 'service');
            const status = status_1.getStatus(this.display);
            status.push(`Intercept starting up on ${this.params.remoteService}...`);
            yield this.pause();
            status.info(`Redirecting ${this.params.remoteService}`);
            yield this.pause();
            status.push(`Intercept started, requests are now sent to ${this.params.remoteService} are now redirected to localhost`);
            status.pop();
            status.pop();
        });
    }
}
exports.InterceptDemo = InterceptDemo;
//# sourceMappingURL=intercept.js.map