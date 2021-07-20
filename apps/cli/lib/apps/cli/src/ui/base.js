"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TerminalUI = void 0;
const tslib_1 = require("tslib");
const inquirer = tslib_1.__importStar(require("inquirer"));
const display_1 = require("./display");
class TerminalUI {
    constructor(params) {
        this.params = params;
        this.reporter = new display_1.CLIReporter(this.params);
    }
    prompt(...questions) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (this.params.noInput)
                return this.params;
            const resolved = yield Promise.all(questions.filter(q => q));
            const init = [];
            const prompts = resolved.reduce((all, item) => {
                if (!item)
                    return all;
                if (Array.isArray(item)) {
                    if (!item.length)
                        return all;
                    return all.concat(item);
                }
                all.push(item);
                return all;
            }, init);
            return yield inquirer.prompt(prompts, this.params);
        });
    }
    list(items, displayField, header, displayClass = 'highlight') {
        this.listStrings(items.map(item => item[displayField]), header, displayClass);
    }
    listStrings(items, header, displayClass = 'highlight') {
        if (header) {
            this.reporter.print(header, 'important');
            this.reporter.newline();
        }
        for (const item of items) {
            this.reporter.print('• ' + item, displayClass);
        }
    }
    confirm(message, defaultValue = true) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (this.params.noInput)
                return defaultValue;
            const response = yield inquirer.prompt({
                type: 'confirm',
                name: 'confirmPrompt',
                default: false,
                message
            });
            return !!response.confirmPrompt;
        });
    }
    selectOne(items, message, resultField, displayField) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (this.params.noInput)
                return items[0];
            return yield inquirer.prompt([{
                    type: 'list',
                    message,
                    name: resultField,
                    when: (answers) => {
                        if (items.length === 1)
                            answers[resultField] = items[0];
                        return items.length > 1;
                    },
                    choices: items.map(item => ({
                        name: item[displayField],
                        value: item
                    })),
                    default: 0
                }]);
        });
    }
}
exports.TerminalUI = TerminalUI;
//# sourceMappingURL=base.js.map