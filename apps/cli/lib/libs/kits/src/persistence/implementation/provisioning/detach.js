"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.detachWorker = void 0;
const tslib_1 = require("tslib");
const worker_threads_1 = require("worker_threads");
const helper_1 = require("../../helper");
function main(request) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const persistence = new helper_1.Persistence();
        yield persistence.detachDestructiveImplementation(request);
    });
}
if (!worker_threads_1.isMainThread) {
    main(worker_threads_1.workerData).then(_ => process.exit());
}
exports.detachWorker = main;
//# sourceMappingURL=detach.js.map