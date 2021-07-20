"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.portForwardMixin = void 0;
const tslib_1 = require("tslib");
const kubeclient_contracts_1 = require("@c6o/kubeclient-contracts");
const net = tslib_1.__importStar(require("net"));
const find_free_port_1 = tslib_1.__importDefault(require("find-free-port"));
const client_node_1 = require("@kubernetes/client-node");
const portForwardMixin = (base) => { var _a; return _a = class portForwardMixinImp extends base {
        portForward(containerPort, document) {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
                return new Promise((resolve) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                    const server = net.createServer((socket) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                        const portForwardAPI = new client_node_1.PortForward(this.kubeConfig);
                        yield portForwardAPI.portForward(document.metadata.namespace, document.metadata.name, [containerPort], socket, null, socket);
                    }));
                    const ports = yield find_free_port_1.default(++portForwardMixinImp.lastForwardedPort);
                    const localPort = ports[0];
                    portForwardMixinImp.lastForwardedPort = localPort;
                    server.listen(localPort, '127.0.0.1', () => {
                        resolve(new kubeclient_contracts_1.Result({
                            server,
                            localPort,
                            containerPort,
                            disposer: () => server.close()
                        }));
                    });
                }));
            });
        }
    },
    _a.lastForwardedPort = 29999,
    _a; };
exports.portForwardMixin = portForwardMixin;
//# sourceMappingURL=portForward.js.map