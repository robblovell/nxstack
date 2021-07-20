"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiMixin = void 0;
const tslib_1 = require("tslib");
const yaml = tslib_1.__importStar(require("js-yaml"));
const buffer_1 = require("buffer");
const apiMixin = (base) => class extends base {
    constructor() {
        super(...arguments);
        this.getPrometheusDeployment = (namespace) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const deployment = {
                apiVersion: 'apps/v1',
                kind: 'Deployment',
                metadata: {
                    namespace,
                    name: 'prometheus-server',
                    labels: {
                        app: 'prometheus',
                        component: 'server'
                    }
                }
            };
            return yield this.controller.cluster.read(deployment);
        });
    }
    clearAll(namespace, clientNamespace, clientApp) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield this.beginConfig(namespace, clientNamespace, clientApp);
            yield this.removeAllJobs();
            yield this.endConfig();
        });
    }
    beginConfig(namespace, clientNamespace, clientApp) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (this.runningDeployment)
                throw Error('There is already a running configuration transaction');
            let result = yield this.getPrometheusDeployment(namespace);
            result.throwIfError();
            this.runningDeployment = result.as();
            this.clientNamespace = clientNamespace;
            this.clientApp = clientApp;
            result = yield this.controller.cluster.read({
                kind: 'ConfigMap',
                metadata: {
                    namespace,
                    name: 'prometheus-server'
                }
            });
            if (result.error)
                throw result.error;
            this.configMap = result.object;
            this.prometheusConfig = yaml.load(this.configMap.data['prometheus.yml']);
            this.hasConfigChanged = false;
            this.addedSecrets = [];
            this.removedSecrets = [];
        });
    }
    addJobs(jobs) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const scrapeConfigs = this.prometheusConfig['scrape_configs'];
            jobs.forEach(job => {
                const newJobName = `${this.clientNamespace}-${this.clientApp}-${job['job_name']}`;
                const found = scrapeConfigs.find(e => e['job_name'] === newJobName);
                if (!found) {
                    job['job_name'] = newJobName;
                    scrapeConfigs.push(job);
                }
            });
            this.hasConfigChanged = true;
        });
    }
    removeJob(jobName) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const newJobName = `${this.clientNamespace}-${this.clientApp}-${jobName}`;
            const scrapeConfigs = this.prometheusConfig['scrape_configs'];
            const found = scrapeConfigs.find(e => e['job_name'] === newJobName);
            if (found) {
                this.prometheusConfig['scrape_configs'] = scrapeConfigs.filter(job => job['job_name'] !== newJobName);
                this.hasConfigChanged = true;
            }
        });
    }
    removeAllJobs() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const jobPrefix = `${this.clientNamespace}-${this.clientApp}`;
            const scrapeConfigs = this.prometheusConfig['scrape_configs'];
            const found = scrapeConfigs.find(e => e['job_name'].startsWith(jobPrefix));
            if (found) {
                this.prometheusConfig['scrape_configs'] = scrapeConfigs.filter(job => !job['job_name'].startsWith(jobPrefix));
                this.hasConfigChanged = true;
            }
        });
    }
    addTlsCerts(name, certs) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const namespace = this.runningDeployment.metadata.namespace;
            const certName = `${this.clientNamespace}-${this.clientApp}-${name}`;
            const newSecret = this.certSecret(`prometheus-${certName}`, namespace);
            const secretsData = newSecret['data'] = {};
            secretsData['ca.pem'] = certs.ca_file ? buffer_1.Buffer.from(certs.ca_file).toString('base64') : '';
            secretsData['cert.pem'] = certs.cert_file ? buffer_1.Buffer.from(certs.cert_file).toString('base64') : '';
            secretsData['key.pem'] = certs.key_file ? buffer_1.Buffer.from(certs.key_file).toString('base64') : '';
            this.addedSecrets.push(newSecret);
            const volume = {
                name: `cert-${certName}`,
                secret: {
                    defaultMode: 420,
                    secretName: `prometheus-${certName}`
                }
            };
            const volumeMount = {
                name: `cert-${certName}`,
                mountPath: `/etc/certs/${certName}`
            };
            const volumeArray = this.runningDeployment.spec.template.spec.volumes;
            let index = volumeArray.findIndex(vol => vol.name === volume.name);
            if (index === -1)
                volumeArray.push(volume);
            const volumeMountArray = this.runningDeployment.spec.template.spec.containers[1].volumeMounts;
            index = volumeMountArray.findIndex(vol => vol.name === volumeMount.name);
            if (index === -1)
                volumeMountArray.push(volumeMount);
        });
    }
    removeTlsCerts(name) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const namespace = this.runningDeployment.metadata.namespace;
            const certName = `${this.clientNamespace}-${this.clientApp}-${name}`;
            const removeSecret = this.certSecret(name, namespace);
            this.removedSecrets.push(removeSecret);
            const volumeName = `cert-${certName}`;
            const volumeArray = this.runningDeployment.spec.template.spec.volumes;
            let index = volumeArray.findIndex(vol => vol.name === volumeName);
            if (index !== -1)
                volumeArray.splice(index, 1);
            const volumeMountArray = this.runningDeployment.spec.template.spec.containers[1].volumeMounts;
            index = volumeMountArray.findIndex(vol => vol.name === volumeName);
            if (index !== -1)
                volumeMountArray.splice(index, 1);
        });
    }
    certSecret(name, namespace) {
        return {
            kind: 'Secret',
            metadata: {
                name,
                namespace,
                labels: {
                    name: 'prometheus-server'
                }
            },
            type: 'Opaque'
        };
    }
    endConfig() {
        var _a;
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let restart = false;
            if (this.hasConfigChanged) {
                const result = yield this.controller.cluster.patch(this.configMap, {
                    data: {
                        'prometheus.yml': yaml.dump(this.prometheusConfig)
                    }
                });
                result.throwIfError();
                restart = true;
            }
            for (const secret of this.addedSecrets) {
                const result = yield this.controller.cluster.upsert(secret);
                result.throwIfError();
                restart = true;
            }
            for (const secret of this.removedSecrets) {
                const result = yield this.controller.cluster.delete(secret);
                result.throwIfError();
                restart = true;
            }
            if (restart) {
                yield this.controller.cluster.upsert(this.runningDeployment);
                const previousCount = ((_a = this.runningDeployment.spec) === null || _a === void 0 ? void 0 : _a.replicas) || 0;
                yield this.controller.cluster.patch(this.runningDeployment, { spec: { replicas: 0 } });
                yield this.controller.cluster.patch(this.runningDeployment, { spec: { replicas: previousCount } });
            }
            this.runningDeployment = null;
        });
    }
};
exports.apiMixin = apiMixin;
//# sourceMappingURL=api.js.map