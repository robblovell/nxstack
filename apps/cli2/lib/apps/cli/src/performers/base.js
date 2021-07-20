"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Performer = void 0;
const tslib_1 = require("tslib");
const inquirer = tslib_1.__importStar(require("inquirer"));
class Performer {
    constructor(_params = {}, display) {
        this._params = _params;
        this.display = display;
        this.pause = (delay = 2000) => new Promise((resolve) => setTimeout(resolve, delay));
    }
    get params() { return this._params; }
    orchestrate() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (this.params.demo) {
                yield this.demo();
            }
            else {
                yield this.ensure();
                yield this.perform();
            }
        });
    }
    ensure(demo = false) {
        throw new Error('Ensure for command not implemented');
    }
    perform() {
        throw new Error('Perform for command not implemented');
    }
    demo() {
        throw new Error('Perform for command not implemented');
    }
    prompt(questions, initialAnswers) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (this.params.noInput)
                return initialAnswers;
            return yield inquirer.prompt(questions, initialAnswers);
        });
    }
}
exports.Performer = Performer;
//# sourceMappingURL=base.js.map