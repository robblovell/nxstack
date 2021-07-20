"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppPublishPerformer = void 0;
const tslib_1 = require("tslib");
const kits_1 = require("@c6o/kits");
const base_1 = require("./base");
class AppPublishPerformer extends base_1.AppPerformer {
    ensure() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            this.ensureManifestFile();
            yield this.ensureAccountRecord();
        });
    }
    perform() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            for (const singleManifest of this.getManifests())
                yield this.publishManifest(singleManifest);
        });
    }
    ensureManifestFile() {
        if (this.params.manifestFile)
            return;
        const { manifest, forgive } = this.params;
        const manifestFile = kits_1.loadLocalAppManifests(this.params.manifest);
        if (!manifestFile || !(manifestFile.appId || Array.isArray(manifestFile))) {
            if (forgive)
                return this.display.warn(`Skipping ${manifest}`);
            else
                throw new Error(`Failed to load the manifest from ${manifest}`);
        }
        this.params.manifestFile = manifestFile;
    }
    ensureAccountRecord() {
        const _super = Object.create(null, {
            prompt: { get: () => super.prompt }
        });
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (this.params.accountRecord)
                return;
            const accounts = yield this.hubClient.getAccounts();
            const account = this.params.account ? accounts.find(account => account.namespace === this.params.account) : undefined;
            if (this.params.account && !account)
                throw new Error(`Could not find account ${this.params.account}`);
            const response = yield _super.prompt.call(this, [
                {
                    type: 'list',
                    name: 'account',
                    message: 'Which account does this Application belong to?',
                    when: accounts.length > 1,
                    choices: _ => accounts.map(account => ({ name: account.name, value: account })),
                    default: 0
                }
            ], { account });
            this.params.accountRecord = response.account;
            if (!this.params.accountRecord)
                throw new Error('Unable to determine account to publish to');
        });
    }
    *getManifests() {
        if (Array.isArray(this.params.manifestFile)) {
            for (const singleManifest of this.params.manifestFile)
                yield singleManifest;
        }
        else
            yield this.params.manifestFile;
    }
    publishManifest(manifestFile) {
        var _a;
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (this.params.dryRun) {
                this.display.highlight(`Application ${manifestFile.appId} updated`);
                return;
            }
            if (((_a = this.params.accountRecord) === null || _a === void 0 ? void 0 : _a.type) === 'o')
                manifestFile.orgId = this.params.accountRecord._id;
            const result = yield this.hubClient.upsertFromManifest(manifestFile);
            this.display.highlight(`Application ${result.namespace} updated`);
        });
    }
}
exports.AppPublishPerformer = AppPublishPerformer;
//# sourceMappingURL=publish.js.map