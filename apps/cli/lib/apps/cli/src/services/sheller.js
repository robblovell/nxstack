"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sheller = void 0;
const tslib_1 = require("tslib");
const object_hash_1 = tslib_1.__importDefault(require("object-hash"));
const child_process_1 = require("child_process");
const session_1 = require("./session");
class Sheller extends session_1.SessionService {
    constructor() {
        super(...arguments);
        this.shell = null;
    }
    get signature() { return `spawn-sheller-${object_hash_1.default(this.params.envKeys)}`; }
    execute() {
        const userShell = process.env.SHELL || '/bin/sh';
        const shellOptions = {
            shell: true,
            stdio: 'inherit',
            env: Object.assign(Object.assign({}, process.env), this.params.envKeys)
        };
        this.shell = child_process_1.spawn(userShell, [], shellOptions);
        return;
    }
    executeCleanup() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (this.shell.killed)
                return false;
            yield this.shell.kill();
            return true;
        });
    }
    sessionInProgress() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return !!this.shell && !this.shell.killed;
        });
    }
    on(event, listener) {
        this.shell.on(event, listener);
        return this;
    }
}
exports.Sheller = Sheller;
//# sourceMappingURL=sheller.js.map