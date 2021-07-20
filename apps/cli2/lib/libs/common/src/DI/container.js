"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inject = exports.injectable = exports.container = void 0;
const tslib_1 = require("tslib");
require("reflect-metadata");
const inversify_1 = require("inversify");
Object.defineProperty(exports, "injectable", { enumerable: true, get: function () { return inversify_1.injectable; } });
const inversify_inject_decorators_1 = tslib_1.__importDefault(require("inversify-inject-decorators"));
const container = new inversify_1.Container({ skipBaseClassChecks: true });
exports.container = container;
const decorators = inversify_inject_decorators_1.default(container);
const inject = decorators.lazyInject;
exports.inject = inject;
//# sourceMappingURL=container.js.map