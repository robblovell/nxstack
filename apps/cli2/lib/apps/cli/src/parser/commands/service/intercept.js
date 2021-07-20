"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InterceptService = void 0;
const tslib_1 = require("tslib");
const command_1 = require("@oclif/command");
const base_1 = require("../../base");
const kubernetes_1 = require("../../kubernetes");
const orchestrators_1 = require("../../../orchestrators");
const flags_1 = require("../../flags");
class InterceptService extends base_1.BaseCommand {
    constructor() {
        super(...arguments);
        this.flagMaps = Object.assign(Object.assign({}, kubernetes_1.KubernetesNamespacedCommand.flagMaps), { service: 'remoteService', port: 'remotePort' });
    }
    go() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield new orchestrators_1.Intercept(this.params).apply();
        });
    }
}
exports.InterceptService = InterceptService;
InterceptService.description = 'Intercept Service traffic to a local tunnel';
InterceptService.examples = [
    'czctl service intercept <service name> -r <remote port> -l <local port> -n <namespace>',
    'czctl service intercept foo --remotePort 3000 --namespace bar',
    'czctl service intercept foo -r 8080 -n bar'
];
InterceptService.strict = false;
InterceptService.flags = Object.assign(Object.assign(Object.assign({}, kubernetes_1.KubernetesNamespacedCommand.flags), flags_1.sessionFlags()), { localPort: command_1.flags.integer({ char: 'l', description: 'The local port number of the local service' }), remotePort: command_1.flags.integer({ char: 'r', description: 'The remote port number of the remote service to be intercepted.' }), all: command_1.flags.boolean({ char: 'a', description: 'Intercept all traffic irrespective of headers' }), header: command_1.flags.string({ char: 'x', description: 'Custom intercept header and value header:value. Default is X-C6O-INTERCEPT:yes' }) });
InterceptService.args = [{
        name: 'service',
        description: 'The name of the remote service to be intercepted.',
    }];
//# sourceMappingURL=intercept.js.map