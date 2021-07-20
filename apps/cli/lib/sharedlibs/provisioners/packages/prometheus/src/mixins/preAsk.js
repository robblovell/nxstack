"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.preAskMixin = void 0;
const tslib_1 = require("tslib");
const yaml = tslib_1.__importStar(require("js-yaml"));
const path = tslib_1.__importStar(require("path"));
const os_1 = require("os");
const fs_1 = require("fs");
const inquirer_1 = tslib_1.__importDefault(require("inquirer"));
const common_1 = require("@provisioner/common");
function resolvePath(filePath) {
    if (!filePath)
        return '';
    if (filePath[0] === '~' && (filePath[1] === '/' || filePath.length === 1))
        return filePath.replace('~', os_1.homedir());
    return path.resolve(filePath);
}
const preAskMixin = (base) => class extends base {
    preask(options) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (options['addJob'])
                yield this.preAddJob(options);
            if (options['removeJob'])
                yield this.preRemoveJob(options);
            if (options['addCert'])
                yield this.preAddCert(options);
            if (options['removeCert'])
                yield this.preRemoveCert(options);
        });
    }
    setPrometheusNamespace() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const apps = yield common_1.AppHelper.from(null, 'prometheus').list(this.controller.cluster, 'Failed to find Prometheus');
            const choices = apps.map(app => app.metadata.namespace);
            if (choices.length == 1) {
                this.prometheusNamespace = choices[0];
            }
            else if (choices.length > 1) {
                const selection = yield inquirer_1.default.prompt({
                    type: 'list',
                    name: 'namespace',
                    message: `Which prometheus would you like to ask?`,
                    choices
                });
                this.prometheusNamespace = selection.namespace;
            }
        });
    }
    preAddJob(options) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield this.setPrometheusNamespace();
            const jobFile = options['addJob'];
            const jobYaml = yield fs_1.promises.readFile(resolvePath(jobFile), 'utf8');
            this.jobConfig = yaml.load(jobYaml);
        });
    }
    preRemoveJob(options) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield this.setPrometheusNamespace();
            this.removeJobName = options['removeJob'];
        });
    }
    preAddCert(options) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield this.setPrometheusNamespace();
            const certPath = options['addCert'];
            let file = yield fs_1.promises.readFile(resolvePath(`${certPath}/ca.pem`), 'utf8');
            const caFile = file.toString();
            let certFile = '';
            let keyFile = '';
            try {
                file = yield fs_1.promises.readFile(resolvePath(`${certPath}/cert.pem`), 'utf8');
                certFile = file.toString();
                file = yield fs_1.promises.readFile(resolvePath(`${certPath}/key.pem`), 'utf8');
                keyFile = file.toString();
            }
            catch (e) {
            }
            this.certName = certPath.split('/').pop();
            this.certFiles = {
                'ca_file': caFile,
                'cert_file': certFile,
                'key_file': keyFile
            };
        });
    }
    preRemoveCert(options) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield this.setPrometheusNamespace();
            this.certName = options['removeCert'];
        });
    }
};
exports.preAskMixin = preAskMixin;
//# sourceMappingURL=preAsk.js.map