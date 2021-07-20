"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createInquireMixin = void 0;
const tslib_1 = require("tslib");
const inquirer_1 = tslib_1.__importDefault(require("inquirer"));
const common_1 = require("@provisioner/common");
const createInquireMixin = (base) => class extends base {
    constructor() {
        super(...arguments);
        this.storageChoices = ['1Gi', '2Gi', '5Gi', '10Gi', '20Gi', '50Gi', '100Gi'];
    }
    inquire(args) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const answers = {
                storageClass: args['storage-class'] || (yield common_1.StorageClassHelper.getDefault(this.controller.cluster)),
                storage: args['storage'] || this.spec.storage,
                adminUsername: args['username'] || this.spec.username,
                adminPassword: args['password'] || this.spec.password,
            };
            const responses = yield inquirer_1.default.prompt([
                common_1.StorageClassHelper.inquire(this.controller.cluster, {
                    name: 'storageClass'
                }),
                {
                    type: 'list',
                    name: 'storage',
                    message: 'What size data volume would you like for your log storage?',
                    choices: this.storageChoices,
                    default: this.spec.storage || '2Gi'
                }, {
                    type: 'input',
                    name: 'adminUsername',
                    message: 'What is the admin username?',
                    default: this.spec.adminUsername || 'admin'
                }, {
                    type: 'password',
                    name: 'adminPassword',
                    message: 'What is the admin password?',
                    default: this.spec.adminPassword || 'admin'
                }
            ], answers);
            return responses;
        });
    }
    createInquire(args) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const results = yield this.inquire(args);
            this.spec.storageClass = results.storageClass;
            this.spec.storage = results.storage;
            this.spec.adminUsername = results.adminUsername;
            this.spec.adminPassword = results.adminPassword;
        });
    }
};
exports.createInquireMixin = createInquireMixin;
//# sourceMappingURL=createInquire.js.map