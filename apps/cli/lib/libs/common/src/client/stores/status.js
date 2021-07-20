"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatusStore = void 0;
const tslib_1 = require("tslib");
const inversify_1 = require("inversify");
const mobx_1 = require("mobx");
const symbols_1 = require("../../DI/symbols");
let StatusStore = class StatusStore {
    get initialized() { return !!this.status; }
    fetch(path) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const url = `${this.config.apiURL}${path}`;
            console.log('API:', url);
            try {
                const result = yield window.fetch(url);
                if (result.status === 200) {
                    const status = yield result.json();
                    this.config.init(status.config);
                    this.status = status;
                    console.log(`STATUS: version ${this.status.version} of sha ${this.status.gitSHA}`);
                }
            }
            catch (ex) {
                console.log(`Failed to connect to API at ${url}`, ex);
            }
        });
    }
};
tslib_1.__decorate([
    inversify_1.inject(symbols_1.Symbols.config),
    tslib_1.__metadata("design:type", Object)
], StatusStore.prototype, "config", void 0);
tslib_1.__decorate([
    mobx_1.observable,
    tslib_1.__metadata("design:type", Object)
], StatusStore.prototype, "status", void 0);
tslib_1.__decorate([
    mobx_1.computed,
    tslib_1.__metadata("design:type", Object),
    tslib_1.__metadata("design:paramtypes", [])
], StatusStore.prototype, "initialized", null);
StatusStore = tslib_1.__decorate([
    inversify_1.injectable()
], StatusStore);
exports.StatusStore = StatusStore;
//# sourceMappingURL=status.js.map