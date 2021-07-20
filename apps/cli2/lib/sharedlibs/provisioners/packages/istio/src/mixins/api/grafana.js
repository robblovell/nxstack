"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.grafanaMixin = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@provisioner/common");
const Handlebars = tslib_1.__importStar(require("handlebars"));
const constants_1 = require("../../constants");
const dashboards = [
    'citadel-dashboard',
    'galley-dashboard',
    'istio-mesh-dashboard',
    'istio-performance-dashboard',
    'istio-service-dashboard',
    'istio-workload-dashboard',
    'mixer-dashboard',
    'pilot-dashboard'
];
const grafanaMixin = (base) => class extends base {
    linkGrafana(grafanaNamespace, serviceNamespace) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield this.unlinkGrafana(serviceNamespace, false);
            const grafanaProvisioner = yield this.controller.resolver.getProvisioner(grafanaNamespace, 'grafana');
            yield grafanaProvisioner.beginConfig(grafanaNamespace, serviceNamespace, 'istio');
            const prometheusLink = this.spec['prometheus-link'];
            let dataSourceName;
            if (prometheusLink && prometheusLink !== constants_1.unlinkToken) {
                dataSourceName = yield grafanaProvisioner.addDataSource('prometheus', {
                    access: 'proxy',
                    editable: true,
                    isDefault: true,
                    jsonData: {
                        timeInterval: '5s'
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
                yield this.addDashboard(grafanaProvisioner, dashboard, params);
            }
            yield grafanaProvisioner.endConfig();
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
    addDashboard(grafanaProvisioner, name, params) {
        const _super = Object.create(null, {
            readFile: { get: () => super.readFile }
        });
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const source = yield _super.readFile.call(this, __dirname, `../../../grafana/${name}.json`);
            if (!params)
                return yield grafanaProvisioner.addDashboard(name, source);
            const template = Handlebars.compile(source, { noEscape: true });
            const content = template(params);
            return yield grafanaProvisioner.addDashboard(name, content);
        });
    }
};
exports.grafanaMixin = grafanaMixin;
//# sourceMappingURL=grafana.js.map