"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Processor = void 0;
const tslib_1 = require("tslib");
const mixwith_1 = require("mixwith");
const debug_1 = tslib_1.__importDefault(require("debug"));
const kubeclient_contracts_1 = require("@c6o/kubeclient-contracts");
const mixins_1 = require("./mixins");
const debug = debug_1.default('kubeclient:processor');
const processorMixin = mixwith_1.mix(Object).with(mixins_1.applyMixin, mixins_1.attemptMixin, mixins_1.copyMixin, mixins_1.crudMixin, mixins_1.execMixin, mixins_1.ifMixin, mixins_1.portForwardMixin, mixins_1.watchMixin);
class Processor extends processorMixin {
    constructor(cluster, stageName) {
        super();
        this.cluster = cluster;
        this.stageName = stageName;
        this.sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
        this.commands = [];
        this.additions = [];
        this.waitListPromises = [];
        this.ended = false;
        this.waitList = (promise) => this.waitListPromises.push(promise);
    }
    ensureVersion() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (!this.cluster.info) {
                const result = yield this.cluster.version();
                this.cluster.info = result;
            }
        });
    }
    runWorker() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            while (this.commands.length || this.additions.length) {
                if (this.additions.length) {
                    this.commands.unshift(...this.additions);
                    this.additions = [];
                }
                this.currentCommand = this.commands.shift();
                debug('EXECUTING: %s', this.currentCommand.name || 'Anonymous function');
                this.lastResult = (yield this.currentCommand(this.lastResult, this)) || kubeclient_contracts_1.Result.undefined;
                debug('RESULT: %o', this.lastResult);
                this.lastCommand = this.currentCommand;
                if (this.lastResult.error && !this.lastResult.suppress)
                    throw this.lastResult.error;
            }
        });
    }
    do(cmd) {
        if (this.ended)
            throw new Error('Attempt to add a command to an ended processor');
        if (this.currentCommand) {
            this.additions.push(cmd);
            return this;
        }
        this.commands.push(cmd);
        return this;
    }
    end() {
        var _a, _b, _c;
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (this.currentCommand)
                throw new Error('Attempt to run an already running processor');
            yield this.ensureVersion();
            const savedProcessor = this.cluster.processor;
            this.cluster.processor = this;
            try {
                if (this.stageName)
                    (_a = this.cluster.status) === null || _a === void 0 ? void 0 : _a.push(this.stageName);
                yield this.runWorker();
                this.ended = true;
                yield Promise.all(this.waitListPromises);
                if (this.stageName)
                    (_b = this.cluster.status) === null || _b === void 0 ? void 0 : _b.pop();
            }
            catch (ex) {
                if (this.stageName)
                    (_c = this.cluster.status) === null || _c === void 0 ? void 0 : _c.error(ex);
                throw ex;
            }
            finally {
                this.cluster.processor = savedProcessor;
            }
            return this.lastResult;
        });
    }
}
exports.Processor = Processor;
//# sourceMappingURL=index.js.map