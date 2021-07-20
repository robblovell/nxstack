"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Result = void 0;
const tslib_1 = require("tslib");
const ts_try_1 = require("ts-try");
class Result {
    constructor(result) {
        if (ts_try_1.isError(result)) {
            this.error = result;
            if (this.error.error && typeof this.error.error != 'string')
                this.error = this.error.error;
        }
        else if (result != undefined) {
            if (result.kind)
                this.object = result;
            else
                this.other = result;
        }
    }
    get errorMessage() { return this.error ? this.error.message : undefined; }
    get errorCode() { return this.error ? this.error.statusCode || this.error.code : undefined; }
    get hasItems() { var _a, _b; return (_b = (_a = this.object) === null || _a === void 0 ? void 0 : _a.items) === null || _b === void 0 ? void 0 : _b.length; }
    static from(fn) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (fn) {
                const result = yield ts_try_1.tryF(fn);
                return new Result(result);
            }
            return Result.undefined;
        });
    }
    as() {
        return this.object;
    }
    *each(kind) {
        var _a;
        if (!((_a = this.object) === null || _a === void 0 ? void 0 : _a.items))
            return;
        for (const item of this.object.items)
            yield Object.assign({ apiVersion: this.object.apiVersion, kind }, item);
    }
    throwIfError(message) {
        if (this.error) {
            if (message)
                throw new Error(message);
            else if (this.errorCode)
                throw this.error;
            else
                throw new Error(this.errorMessage);
        }
    }
    otherAs() {
        return this.other;
    }
}
exports.Result = Result;
Result.undefined = new Result(undefined);
//# sourceMappingURL=result.js.map