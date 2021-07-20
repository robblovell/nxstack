"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProvisionerManager = void 0;
const tslib_1 = require("tslib");
const events_1 = require("events");
const kubeclient_contracts_1 = require("@c6o/kubeclient-contracts");
const kubeclient_1 = require("@c6o/kubeclient");
const contracts_1 = require("@provisioner/contracts");
const path = tslib_1.__importStar(require("path"));
const transactions_1 = require("./transactions");
const adapters_1 = require("./adapters");
class ProvisionerManager extends events_1.EventEmitter {
    constructor(options) {
        super();
        this.cluster = (options === null || options === void 0 ? void 0 : options.cluster) || new kubeclient_1.Cluster();
        this.noInput = options === null || options === void 0 ? void 0 : options.noInput;
        this.status = options === null || options === void 0 ? void 0 : options.status;
    }
    get transactionHelper() {
        if (this._transactionHelper)
            return this._transactionHelper;
        return this._transactionHelper = new transactions_1.TransactionHelper(this.adapter);
    }
    get status() { return this._status; }
    set status(value) {
        this._status = value;
        this.cluster.status = value;
    }
    setStage(stage) {
        this.stage = stage;
        this.emit(stage, this.adapter.resource);
    }
    loadAdapter(stringOrDocument) {
        const kind = kubeclient_contracts_1.ResourceHelper.isResource(stringOrDocument) ?
            stringOrDocument.kind :
            stringOrDocument;
        switch (kind) {
            case 'App':
                this.adapter = new adapters_1.AppAdapter(this, kubeclient_contracts_1.ResourceHelper.isResource(stringOrDocument) ? stringOrDocument : undefined);
                break;
            default:
                throw new Error(`Adapter for resource ${kind} not found`);
        }
        return this.adapter;
    }
    load(resource) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (!resource)
                throw new Error('Document is required');
            this.loadAdapter(resource);
            this.setStage('load');
            yield this.adapter.load();
        });
    }
    exec(execService, ...execArgs) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            throw new Error('Exec is temporarily under development');
        });
    }
    help(command, option, messages) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
        });
    }
    inquire(options) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (!this.noInput) {
                this.setStage('inquire');
                yield this.adapter.inquire(options);
            }
        });
    }
    validate() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            this.setStage('validate');
            yield this.adapter.validate();
        });
    }
    applyLocal() {
        var _a;
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            this.setStage('apply');
            yield this.adapter.preApply();
            if (yield this.transactionHelper.beginTransaction()) {
                try {
                    yield this.adapter.apply();
                    yield this.transactionHelper.endTransaction();
                }
                catch (ex) {
                    const recover = yield this.adapter.error(ex);
                    if (!recover)
                        throw ex;
                }
            }
            else
                (_a = this.status) === null || _a === void 0 ? void 0 : _a.warn(`Cannot ${this.action} ${this.adapter.resource.kind} ${this.adapter.resource.metadata.name} as it has been modified.`);
        });
    }
    apply() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            this.setStage('apply');
            yield this.adapter.preApply();
            let result;
            switch (this.action) {
                case 'create':
                    result = yield this.cluster.create(this.adapter.resource);
                    break;
                case 'update':
                    contracts_1.signalDocument(this.adapter.resource);
                    result = yield this.cluster.patch(this.adapter.resource, this.adapter.resource);
                    break;
                case 'remove':
                    result = yield this.cluster.upsert(this.adapter.resource);
                    result.throwIfError();
                    result = yield this.cluster.delete(this.adapter.resource);
                    break;
            }
            result.throwIfError();
            return result.object;
        });
    }
    perform(resource, action, answers) {
        var _a, _b, _c;
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            this.action = action;
            try {
                (_a = this.status) === null || _a === void 0 ? void 0 : _a.push(`Performing ${this.action} on ${resource.kind} ${resource.metadata.name}`);
                if (answers === null || answers === void 0 ? void 0 : answers.package) {
                    resource.spec.provisioner.package = path.resolve(answers.package);
                }
                yield this.load(resource);
                yield this.inquire(answers);
                yield this.validate();
                if (answers['spec-only'])
                    return this.adapter.resource;
                if (answers === null || answers === void 0 ? void 0 : answers.local) {
                    return yield this.applyLocal();
                }
                else {
                    return yield this.apply();
                }
            }
            catch (ex) {
                (_b = this.status) === null || _b === void 0 ? void 0 : _b.error(ex);
                throw ex;
            }
            finally {
                (_c = this.status) === null || _c === void 0 ? void 0 : _c.pop();
                this.setStage('done');
            }
        });
    }
}
exports.ProvisionerManager = ProvisionerManager;
//# sourceMappingURL=manager.js.map