"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MemoryStorage = void 0;
const tslib_1 = require("tslib");
const inversify_1 = require("inversify");
let MemoryStorage = class MemoryStorage {
    constructor() {
        this.storage = {};
        this.key = (n) => Object.keys(this.storage)[n];
        this.getItem = (key) => this.storage[key];
        this.setItem = (key, value) => this.storage[key] = value;
        this.removeItem = (key) => delete this.storage[key];
        this.clear = () => {
            delete this.storage;
            this.storage = {};
        };
    }
};
MemoryStorage = tslib_1.__decorate([
    inversify_1.injectable()
], MemoryStorage);
exports.MemoryStorage = MemoryStorage;
//# sourceMappingURL=memory.js.map