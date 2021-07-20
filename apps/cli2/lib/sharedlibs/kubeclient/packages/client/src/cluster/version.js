"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.versionMixin = void 0;
const tslib_1 = require("tslib");
const kubeclient_contracts_1 = require("@c6o/kubeclient-contracts");
const semver_1 = require("semver");
const versionMixin = (base) => class extends base {
    version() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const result = yield kubeclient_contracts_1.Result.from(this.request.get('/version'));
            result.throwIfError();
            const semver = semver_1.parse(result.other.gitVersion);
            return {
                data: result.other,
                eq: (ver) => semver_1.eq(semver, ver),
                neq: (ver) => semver_1.neq(semver, ver),
                compare: (ver) => semver_1.compare(semver, ver),
                gt: (ver) => semver_1.gt(semver, ver),
                gte: (ver) => semver_1.gte(semver, ver),
                lt: (ver) => semver_1.lt(semver, ver),
                lte: (ver) => semver_1.lte(semver, ver)
            };
        });
    }
};
exports.versionMixin = versionMixin;
//# sourceMappingURL=version.js.map