"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metricsMixin = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@provisioner/common");
const Handlebars = tslib_1.__importStar(require("handlebars"));
const constants_1 = require("../../constants");
const debug_1 = tslib_1.__importDefault(require("debug"));
const debug = debug_1.default('c6o-system:metricsMixin:');
const dashboards = [
    'dashboard-kubernetes',
    'dashboard-nodejs'
];
const metricsMixin = (base) => class extends base {
    linkGrafana(grafanaNamespace, serviceNamespace) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield this.unlinkGrafana(serviceNamespace, false);
            this.grafanaProvisioner = yield this.controller.resolver.getProvisioner(grafanaNamespace, 'grafana');
            yield this.grafanaProvisioner.beginConfig(grafanaNamespace, serviceNamespace, 'c6o-system');
            const prometheusLink = this.spec['prometheus-link'];
            let dataSourceName = '';
            if (prometheusLink && prometheusLink !== constants_1.unlinkToken) {
                dataSourceName = yield this.grafanaProvisioner.addDataSource('prometheus', {
                    access: 'proxy',
                    editable: true,
                    isDefault: true,
                    jsonData: {
                        timeInterval: '30s'
                    },
                    orgId: 1,
                    type: 'prometheus',
                    url: `http://prometheus.${prometheusLink}.svc.cluster.local:9090`
                });
            }
            for (const dashboard of dashboards) {
                const params = {
                    dataSource: dataSourceName,
                    istioNamespace: serviceNamespace
                };
                yield this.addDashboard(dashboard, params);
            }
            yield this.grafanaProvisioner.endConfig();
        });
    }
    unlinkGrafana(serviceNamespace, clearLinkField = true) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const grafanaApps = yield common_1.AppHelper.from(null, 'grafana').list(this.controller.cluster, 'Failed to find Grafana');
            for (const grafanaApp of grafanaApps) {
                const grafanaProvisioner = yield this.controller.resolver.getProvisioner(grafanaApp);
                yield grafanaProvisioner.clearConfig(grafanaApp.metadata.namespace, serviceNamespace, 'istio');
            }
            if (clearLinkField)
                delete this.controller.resource.spec.provisioner['grafana-link'];
        });
    }
    addDashboard(name, params) {
        const _super = Object.create(null, {
            readFile: { get: () => super.readFile }
        });
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const source = yield _super.readFile.call(this, __dirname, `../../../grafana/${name}.json`);
            if (!params)
                return yield this.grafanaProvisioner.addDashboard(name, source);
            const template = Handlebars.compile(source, { noEscape: true });
            const content = template(params);
            return yield this.grafanaProvisioner.addDashboard(name, content);
        });
    }
};
exports.metricsMixin = metricsMixin;
//# sourceMappingURL=metrics.js.map