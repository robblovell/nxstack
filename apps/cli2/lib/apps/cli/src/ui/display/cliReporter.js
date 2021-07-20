"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CLIReporter = void 0;
const tslib_1 = require("tslib");
const chalk_1 = tslib_1.__importDefault(require("chalk"));
const cli_ux_1 = require("cli-ux");
class CLIReporter {
    constructor(options, printOut = console.log, errorOut = console.error) {
        this.options = options;
        this.printOut = printOut;
        this.errorOut = errorOut;
        this.SEA = '#5C8BFF';
        this.FIRE = '#ff5a00';
        this.OCEAN = '#26EEFF';
        this.GRASS = '#37EB37';
        this.SUN = '#fae170';
        this.colors = {
            fire: '\\[\\033[38;5;68m\\]',
            ocean: '\\[\\033[38;5;68m\\]',
            reset: '\\[\\033[00m\\]',
            sea: '\\[\\033[38;5;44m\\]',
        };
        this.bkg = {
            error: chalk_1.default.bgHex(this.FIRE),
            highlight: chalk_1.default.bgHex(this.OCEAN),
            subtle: chalk_1.default.bgHex(this.SEA),
            success: chalk_1.default.bgHex(this.GRASS),
            warn: chalk_1.default.bgHex(this.SUN),
        };
        this.msg = {
            error: chalk_1.default.hex(this.FIRE).bold,
            highlight: chalk_1.default.hex(this.OCEAN),
            important: chalk_1.default.hex(this.OCEAN).bold,
            subtle: chalk_1.default.hex(this.SEA),
            success: chalk_1.default.hex(this.GRASS).bold,
            warn: chalk_1.default.hex(this.SUN),
        };
        this.bannerPreamble = `${this.bkg.highlight('  ')}${this.bkg.warn('  ')}${this.bkg.subtle('  ')}${this.bkg.error('  ')}`;
        this.bannerConclusion = `${this.bkg.error('  ')}${this.bkg.subtle('  ')}${this.bkg.warn('  ')}${this.bkg.highlight('  ')}`;
    }
    formatMessage(msg, displayClass) {
        if (!displayClass)
            return msg;
        switch (displayClass) {
            case 'error':
                return this.msg.error(msg);
            case 'warn':
                return this.msg.warn(msg);
            case 'highlight':
                return this.msg.highlight(msg);
            case 'success':
                return this.msg.success(msg);
            default:
                return msg;
        }
    }
    reduceMessages(messages, prefix = '') {
        return Array.isArray(messages) ?
            messages.reduce((accumulator, message) => {
                return accumulator + prefix + `${message}\n`;
            }, '').trim() :
            prefix + `${messages}`;
    }
    print(message, displayClass = '', displayOptions) {
        if (this.options.quiet && displayClass !== 'error')
            return;
        if (displayClass === 'success' || (displayOptions === null || displayOptions === void 0 ? void 0 : displayOptions.spaceBefore))
            this.newline();
        this.printOut(this.formatMessage(this.reduceMessages(message), displayClass));
        if (displayOptions === null || displayOptions === void 0 ? void 0 : displayOptions.spaceAfter)
            this.newline();
    }
    default(message, displayOptions) {
        this.print(message, '', displayOptions);
    }
    error(message, displayOptions) {
        this.print(message, 'error', displayOptions);
    }
    highlight(message, displayOptions) {
        this.print(message, 'highlight', displayOptions);
    }
    success(message, displayOptions) {
        this.print(message, 'success', displayOptions);
    }
    warn(message, displayOptions) {
        this.print(message, 'warn', displayOptions);
    }
    banner(title, messages, displayClass = '') {
        if (!this.options.quiet) {
            this.printOut(this.formatMessage('\u0007\n**********************************************************************', displayClass));
            this.printOut(`${this.bannerPreamble}                ${this.formatMessage(title, displayClass)}                ${this.bannerConclusion}`);
            const textType = displayClass === 'error' || displayClass === 'warn' ? 'highlight' : '';
            this.printOut(this.formatMessage(this.reduceMessages(messages), textType));
            this.printOut(this.formatMessage('**********************************************************************', displayClass));
        }
    }
    url(text, link, pre) {
        if (pre)
            this.printOut(pre);
        cli_ux_1.cli.url(text, link);
    }
    table(data, inputOptions) {
        if (!this.options.quiet)
            cli_ux_1.cli.table(data, inputOptions);
    }
    newline(lineCount = 1) {
        do {
            this.printOut('');
        } while (--lineCount > 0);
    }
}
exports.CLIReporter = CLIReporter;
//# sourceMappingURL=cliReporter.js.map