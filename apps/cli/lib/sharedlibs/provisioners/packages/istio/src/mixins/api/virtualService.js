"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.virtualServiceApiMixin = void 0;
const tslib_1 = require("tslib");
const debug_1 = tslib_1.__importDefault(require("debug"));
const debug = debug_1.default('istio:api:virtualService:');
const virtualServiceApiMixin = (base) => class extends base {
    constructor() {
        super(...arguments);
        this.simpleTcpSection = (route) => {
            const tcp = {
                match: [
                    {
                        port: route.tcp.port
                    }
                ],
                route: [
                    {
                        destination: {
                            host: route.targetService
                        }
                    }
                ]
            };
            if (route.targetPort)
                tcp.route[0].destination.port = { number: route.targetPort };
            return tcp;
        };
        this.simpleHttpSection = (route) => {
            var _a, _b;
            const http = {
                match: [
                    {
                        headers: {
                            ':authority': {
                                'regex': `^${this.getApplicationPrefix(this.app.metadata.name, this.app.metadata.namespace)}\\..*`
                            }
                        }
                    }
                ],
                route: [
                    {
                        destination: {
                            host: route.targetService
                        }
                    }
                ]
            };
            if ((_a = route.http) === null || _a === void 0 ? void 0 : _a.prefix)
                http.match.push({ uri: { prefix: route.http.prefix } });
            if ((_b = route.http) === null || _b === void 0 ? void 0 : _b.rewrite)
                http.rewrite = { uri: route.http.rewrite };
            if (route.targetPort)
                http.route[0].destination.port = { number: route.targetPort };
            return http;
        };
        this.virtualService = (app, gateway) => ({
            apiVersion: 'networking.istio.io/v1alpha3',
            kind: 'VirtualService',
            metadata: {
                name: app.metadata.name,
                namespace: app.metadata.namespace,
                labels: Object.assign({}, app.metadata.labels)
            },
            spec: {
                hosts: ['*'],
                gateways: [gateway],
                http: [],
                tcp: []
            }
        });
        this.gatewayTcpPortTemplate = (route) => ({
            hosts: ['*'],
            port: {
                name: this.getTcpPortName(route),
                protocol: 'TCP',
                number: this.getTcpPortNumber(route)
            }
        });
        this.loadBalancer = {
            apiVersion: 'v1',
            kind: 'Service',
            metadata: {
                name: 'istio-ingressgateway',
                namespace: 'istio-system'
            }
        };
        this.loadBalancerTcpPortTemplate = (route) => ({
            name: this.getTcpPortName(route),
            protocol: 'TCP',
            port: this.getTcpPortNumber(route),
            targetPort: this.getTcpPortNumber(route)
        });
    }
    upsertVirtualService(app, gateway) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            this.app = app;
            if (!app.spec.routes)
                return;
            const vs = this.virtualService(app, gateway);
            for (const route of app.spec.routes) {
                if (route.disabled || route.private)
                    continue;
                if (route.type === 'tcp') {
                    if (!route.tcp.port || route.tcp.port === 0)
                        route.tcp.port = this.generateUsablePortNumber();
                    yield this.checkPortConflict(route);
                    yield this.addTcpPortGateway(route);
                    yield this.addTcpPortLoadBalancer(route);
                    vs.spec.tcp.push(this.simpleTcpSection(route));
                }
            }
            if (vs.spec.tcp.length === 0)
                return;
            const result = yield this.controller.cluster
                .begin(`Installing Virtual Service for ${app.metadata.namespace}/${app.metadata.name}`)
                .addOwner(app)
                .upsert(vs)
                .end();
            return result;
        });
    }
    removeVirtualService(app) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            this.app = app;
            if (!app.spec.routes)
                return;
            for (const route of app.spec.routes) {
                if (route.disabled || route.private)
                    return;
                if (route.type === 'tcp') {
                    yield this.removeTcpPortGateway(route);
                    yield this.removeTcpPortLoadBalancer(route);
                }
            }
            yield this.controller.cluster
                .begin(`Removing Virtual Service for ${app.metadata.namespace}/${app.metadata.name}`)
                .delete({
                apiVersion: 'networking.istio.io/v1alpha3',
                kind: 'VirtualService',
                metadata: {
                    name: app.metadata.name,
                    namespace: app.metadata.namespace
                }
            })
                .end();
        });
    }
    getApplicationPrefix(appName, namespace) { return `${appName}--${namespace}`; }
    getTcpPortNumber(route) {
        return route.tcp.port;
    }
    setTcpPortNumber(route, port) {
        route.tcp.port = port;
    }
    getTcpPortName(route) {
        return `tcp-${this.app.metadata.namespace}-${this.app.metadata.name}-${route.tcp.name}`;
    }
    getGateway() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const result = yield this.controller.cluster.read(this.gateway);
            result.throwIfError();
            return result.object;
        });
    }
    getLoadBalancer() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const result = yield this.controller.cluster.read(this.loadBalancer);
            result.throwIfError();
            return result.object;
        });
    }
    generateUsablePortNumber() {
        return Math.floor(Math.random() * (65535 - 1024 + 1)) + 1024;
    }
    checkPortConflict(route) {
        var _a;
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const portName = this.getTcpPortName(route);
            let portNumber = this.getTcpPortNumber(route);
            const loadBalancer = yield this.getLoadBalancer();
            const loadBalancerPorts = loadBalancer.spec.ports;
            let conflict = loadBalancerPorts.some(item => item.port === portNumber && item.name !== portName);
            if (conflict && ((_a = route.tcp) === null || _a === void 0 ? void 0 : _a.strictPort))
                throw new Error('Port conflict encountered with .tcp.strictPort route setting');
            while (conflict) {
                portNumber = this.generateUsablePortNumber();
                conflict = loadBalancerPorts.some(item => item.port === portNumber);
                if (!conflict)
                    this.setTcpPortNumber(route, portNumber);
            }
        });
    }
    addTcpPortGateway(route) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const gateway = yield this.getGateway();
            const gatewayServers = gateway.spec.servers;
            const item = this.gatewayTcpPortTemplate(route);
            const alreadyExists = gatewayServers.find(item => { var _a; return ((_a = item.port) === null || _a === void 0 ? void 0 : _a.name) === this.getTcpPortName(route); });
            if (!alreadyExists)
                return yield this.controller.cluster.patch(this.gateway, [{ 'op': 'add', 'path': '/spec/servers/-', 'value': item }]);
            const index = gatewayServers.map(function (item) { var _a; return (_a = item.port) === null || _a === void 0 ? void 0 : _a.name; }).indexOf(this.getTcpPortName(route));
            return yield this.controller.cluster.patch(this.gateway, [{ 'op': 'replace', 'path': `/spec/servers/${index}`, 'value': item }]);
        });
    }
    removeTcpPortGateway(route) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const gateway = yield this.getGateway();
            const gatewayServers = gateway.spec.servers;
            const index = gatewayServers.map(function (item) { var _a; return (_a = item.port) === null || _a === void 0 ? void 0 : _a.name; }).indexOf(this.getTcpPortName(route));
            if (index !== -1) {
                return yield this.controller.cluster.patch(this.gateway, [{ 'op': 'remove', 'path': `/spec/servers/${index}` }]);
            }
        });
    }
    addTcpPortLoadBalancer(route) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const loadBalancer = yield this.getLoadBalancer();
            const loadBalancerPorts = loadBalancer.spec.ports;
            const item = this.loadBalancerTcpPortTemplate(route);
            const alreadyExists = loadBalancerPorts.find(item => item.name === this.getTcpPortName(route));
            if (!alreadyExists)
                return yield this.controller.cluster.patch(this.loadBalancer, [{ 'op': 'add', 'path': '/spec/ports/-', 'value': item }]);
            const index = loadBalancerPorts.map(function (item) { return item.name; }).indexOf(this.getTcpPortName(route));
            return yield this.controller.cluster.patch(this.loadBalancer, [{ 'op': 'replace', 'path': `/spec/ports/${index}`, 'value': item }]);
        });
    }
    removeTcpPortLoadBalancer(route) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const loadBalancerPorts = (yield this.getLoadBalancer()).spec.ports;
            const index = loadBalancerPorts.map(function (item) { return item.name; }).indexOf(this.getTcpPortName(route));
            if (index !== -1) {
                return yield this.controller.cluster.patch(this.loadBalancer, [{ 'op': 'remove', 'path': `/spec/ports/${index}` }]);
            }
        });
    }
};
exports.virtualServiceApiMixin = virtualServiceApiMixin;
//# sourceMappingURL=virtualService.js.map