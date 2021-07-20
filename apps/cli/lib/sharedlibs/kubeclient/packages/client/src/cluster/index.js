"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cluster = void 0;
const mixwith_1 = require("mixwith");
const client_node_1 = require("@kubernetes/client-node");
const request_1 = require("../request");
const processor_1 = require("../processor");
const mixins_1 = require("./mixins");
const clusterBaseMixin = mixwith_1.mix(Object).with(mixins_1.crudMixin, mixins_1.execMixin, mixins_1.portForwardMixin, mixins_1.resourceMixin, mixins_1.versionMixin, mixins_1.watchMixin, mixins_1.logsMixin);
class Cluster extends clusterBaseMixin {
    constructor(options = {}) {
        super();
        this.options = options;
        this.processors = [];
    }
    begin(stageName) {
        const processor = new processor_1.Processor(this, stageName);
        this.processors.push(processor);
        return processor;
    }
    get kubeConfig() {
        if (this._kubeConfig)
            return this._kubeConfig;
        this._kubeConfig = new client_node_1.KubeConfig();
        if (this.options.kubeconfig)
            this._kubeConfig.loadFromFile(this.options.kubeconfig);
        else if (this.options.kubestring)
            this._kubeConfig.loadFromString(this.options.kubestring);
        else
            this._kubeConfig.loadFromDefault();
        return this._kubeConfig;
    }
    get request() {
        if (this._request)
            return this._request;
        return this._request = new request_1.Request(this.kubeConfig, this.options.impersonate);
    }
}
exports.Cluster = Cluster;
//# sourceMappingURL=index.js.map