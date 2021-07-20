"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseCommand = void 0;
const tslib_1 = require("tslib");
const command_1 = tslib_1.__importStar(require("@oclif/command"));
const Sentry = tslib_1.__importStar(require("@sentry/node"));
const logger_1 = require("@c6o/logger");
const display_1 = require("../ui/display");
const ui_1 = require("../ui");
const transaction_1 = require("../instrumentation/transaction");
const debug = logger_1.createDebug();
class BaseCommand extends command_1.default {
    constructor() {
        super(...arguments);
        this.flagMaps = Object.assign({}, BaseCommand.flagMaps);
    }
    mapParams(source) {
        return Object.keys(source).reduce((newSource, key) => {
            newSource[this.flagMaps[key] ? this.flagMaps[key] : key] = source[key];
            return newSource;
        }, {});
    }
    getParams() {
        const { flags, args } = this.parse(this.class);
        return this.mapParams(Object.assign(Object.assign({}, args), flags));
    }
    run() {
        const _super = Object.create(null, {
            log: { get: () => super.log },
            error: { get: () => super.error }
        });
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            this.params = this.getParams();
            yield this.startMetricsTransaction();
            this.reporter = new display_1.CLIReporter(this.params, _super.log, _super.error);
            const cliStatus = new ui_1.CLIStatus(this.reporter);
            this.params.status = cliStatus;
            this.reporter.newline(2);
            yield this.go();
            cliStatus.renderWarnings();
            this.reporter.newline(2);
            yield this.endMetricsTransaction();
        });
    }
    startMetricsTransaction() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            this.transaction = yield transaction_1.startMetricsTransaction(this.constructor.name);
        });
    }
    endMetricsTransaction() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield transaction_1.endMetricsTransaction(this.transaction);
        });
    }
    catch(err) {
        const _super = Object.create(null, {
            error: { get: () => super.error }
        });
        var _a;
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            (_a = this.reporter) === null || _a === void 0 ? void 0 : _a.newline();
            debug('error completed completed %o', err);
            Sentry.captureException(err);
            if (this.reporter)
                this.reporter.error(this.errorToMessage(err));
            else
                _super.error.call(this, err);
            this.reporter.newline(2);
        });
    }
    errorToMessage(err) {
        switch (err.code) {
            case 401:
                return `You are not logged into the kubernetes cluster (${err.message})`;
            default:
                return err.message || err;
        }
    }
}
exports.BaseCommand = BaseCommand;
BaseCommand.flags = {
    'dry-run': command_1.flags.boolean({ hidden: true }),
    'demo': command_1.flags.boolean({ hidden: true }),
    'no-input': command_1.flags.boolean({ hidden: true }),
    help: command_1.flags.help({ hidden: true, char: 'h', description: 'Show help for this command' }),
    quiet: command_1.flags.boolean({ char: 'q', description: 'Only display error messages' })
};
BaseCommand.flagMaps = {
    'dry-run': 'dryRun',
    'no-input': 'noInput'
};
//# sourceMappingURL=base.js.map