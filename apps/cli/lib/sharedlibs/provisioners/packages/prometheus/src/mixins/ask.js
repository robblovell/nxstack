"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.askMixin = void 0;
const tslib_1 = require("tslib");
const askMixin = (base) => class extends base {
    ask(options) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (options['addJob']) {
                yield this.beginConfig(this.prometheusNamespace, 'none', 'cli');
                yield this.addJobs(this.jobConfig);
                yield this.endConfig();
            }
            else if (options['removeJob']) {
                yield this.beginConfig(this.prometheusNamespace, 'none', 'cli');
                yield this.removeJob(this.removeJobName);
                yield this.endConfig();
            }
            else if (options['addCert']) {
                yield this.beginConfig(this.prometheusNamespace, 'none', 'cli');
                yield this.addTlsCerts(this.certName, this.certFiles);
                yield this.endConfig();
            }
            else if (options['removeCert']) {
                yield this.beginConfig(this.prometheusNamespace, 'none', 'cli');
                yield this.removeTlsCerts(this.certName);
                yield this.endConfig();
            }
        });
    }
};
exports.askMixin = askMixin;
//# sourceMappingURL=ask.js.map