"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BrowserStorage = void 0;
const tslib_1 = require("tslib");
const inversify_1 = require("inversify");
const LocalStorage = tslib_1.__importStar(require("localstorage-memory"));
let BrowserStorage = class BrowserStorage {
    constructor() {
        this.key = (n) => LocalStorage.key(n);
        this.getItem = (key) => LocalStorage.getItem(key);
        this.setItem = (key, value) => LocalStorage.setItem(key, value);
        this.removeItem = (key) => LocalStorage.removeItem(key);
        this.clear = () => LocalStorage.clear();
    }
};
BrowserStorage = tslib_1.__decorate([
    inversify_1.injectable()
], BrowserStorage);
exports.BrowserStorage = BrowserStorage;
//# sourceMappingURL=browser.js.map