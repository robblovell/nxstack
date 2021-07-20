"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CLIStatus = void 0;
const tslib_1 = require("tslib");
const kubeclient_contracts_1 = require("@c6o/kubeclient-contracts");
const DraftLog = tslib_1.__importStar(require("draftlog"));
const cliCursor = tslib_1.__importStar(require("cli-cursor"));
const stage_1 = require("./stage");
const feathers_1 = require("../../factories/feathers");
class CLIStatus extends kubeclient_contracts_1.Status {
    constructor(reporter, manager) {
        var _a, _b;
        super();
        this.reporter = reporter;
        this.manager = manager;
        this.newStage = () => new stage_1.CLIStage(this.reporter, this.manager);
        DraftLog.into(console);
        (_a = this.manager) === null || _a === void 0 ? void 0 : _a.on('apply', () => this.beginRender());
        (_b = this.manager) === null || _b === void 0 ? void 0 : _b.on('done', () => this.endRender());
    }
    watchRemote(target) {
        const feathers = feathers_1.getFeathers();
        const appService = feathers.createService('api/apps');
        let resolve;
        const promise = new Promise(r => resolve = r);
        appService.on('status', (data) => {
            if (data.done) {
                this.stages.forEach((stage) => stage.render());
                this.endRender();
                resolve();
            }
            else
                this.received(data.items);
        });
        if (!feathers.online) {
            this.reporter.newline();
            this.renderWarning(`Waiting for remote cloud at ${feathers.url}`);
        }
        this.beginRender();
        return promise;
    }
    beginRender() {
        cliCursor.hide();
        this.renderWarnings();
        this.reporter.newline();
        this.stages.forEach((stage) => stage.beginRender());
    }
    endRender() {
        cliCursor.show();
        this.renderWarnings();
        this.renderErrors();
    }
    renderWarnings() {
        var _a;
        if ((_a = this.warnings) === null || _a === void 0 ? void 0 : _a.length)
            this.reporter.newline();
        while (this.warnings.length) {
            const warning = this.warnings.pop();
            this.renderWarning(warning.message);
        }
    }
    renderErrors() {
        if (this.warnings.length)
            this.reporter.newline();
        while (this.errors.length) {
            const error = this.errors.pop();
            this.renderError(error.message);
        }
    }
    renderWarning(msg) {
        this.reporter.warn(msg);
    }
    renderError(msg) {
        this.reporter.error(msg);
    }
}
exports.CLIStatus = CLIStatus;
//# sourceMappingURL=index.js.map