"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CLIStage = void 0;
const tslib_1 = require("tslib");
const kubeclient_contracts_1 = require("@c6o/kubeclient-contracts");
const cli_truncate_1 = tslib_1.__importDefault(require("cli-truncate"));
class CLIStage extends kubeclient_contracts_1.Stage {
    constructor(reporter, manager) {
        super();
        this.reporter = reporter;
        this.manager = manager;
        this.icons = '⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏';
        this.currentIcon = 0;
    }
    begin() {
        super.begin();
        if (this.manager) {
            if (this.manager.stage === 'apply')
                this.beginRender();
        }
        else
            this.beginRender();
    }
    end() {
        super.end();
        if (this.timer) {
            clearInterval(this.timer);
            delete this.timer;
            this.render();
        }
    }
    beginRender() {
        this.draft = console.draft();
        this.indent = ' '.repeat(this.depth + 1);
        let spaces = 70 - this.name.length - this.depth;
        if (spaces < 1)
            spaces = 1;
        this.fillSpaces = ' '.repeat(spaces);
        if (this.condition === 'running')
            this.timer = setInterval(this.render.bind(this), 100);
        else
            this.render();
    }
    render() {
        const drawing = cli_truncate_1.default(this.renderRow(), process.stdout.columns);
        this.draft(drawing);
    }
    renderRow() {
        var _a;
        const icon = this.icons[this.currentIcon++];
        if (this.currentIcon === this.icons.length)
            this.currentIcon = 0;
        switch (this.condition) {
            case 'error':
                return `${this.reporter.msg.error('✖ ')}${this.indent}${this.reporter.msg.error(this.name)}${this.fillSpaces}${this.reporter.msg.error('Failed!')}`;
            case 'skipped':
                return `${this.reporter.msg.warn('✔ ')}${this.indent}${this.reporter.msg.warn(this.name)}${this.fillSpaces}${this.reporter.msg.warn('Skipped')}`;
            case 'done':
                return `${this.reporter.msg.success('✔ ')}${this.indent}${this.reporter.msg.important(this.name)}${this.fillSpaces}${this.reporter.msg.success('Done')}`;
            default:
                return `${this.reporter.msg.warn(`${icon} `)}${this.indent}${this.name}${this.fillSpaces}${this.reporter.msg.warn(((_a = this.latestEvent) === null || _a === void 0 ? void 0 : _a.message) || 'In progress...')}`;
        }
    }
}
exports.CLIStage = CLIStage;
//# sourceMappingURL=stage.js.map