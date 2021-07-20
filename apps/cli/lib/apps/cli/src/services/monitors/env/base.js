"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnvMonitor = void 0;
const tslib_1 = require("tslib");
const logger_1 = require("@c6o/logger");
const fs_1 = require("fs");
const base_1 = require("../base");
const session_1 = require("../../session");
const debug = logger_1.createDebug();
class EnvMonitor extends base_1.Monitor {
    constructor() {
        super(...arguments);
        this.envValues = {};
    }
    refresh() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (!this.params.envFile)
                return;
            let data = {};
            for (const monitor of this.each())
                data = Object.assign(Object.assign({}, data), monitor.envValues);
            const envContent = yield this.formatEnvContent(data);
            debug('env refreshed %s %o', this.key, envContent);
            yield fs_1.promises.writeFile(this.params.envFile, envContent, { encoding: 'utf8', flag: 'w' });
            yield session_1.ensureOwner(this.params.envFile);
        });
    }
    formatEnvContent(data) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            switch (this.params.format) {
                case 'json':
                    return JSON.stringify(data, (key, value) => {
                        if (value.type === 'Buffer') {
                            return Buffer.from(value.data).toString();
                        }
                        return value;
                    }, 2);
                    break;
                case 'yaml':
                    return Object.keys(data).reduce((acc, key) => {
                        acc += `${key}: ${data[key]}\n`;
                        return acc;
                    }, '');
                    break;
                case 'env':
                    return Object.keys(data).reduce((acc, key) => {
                        acc += `${key}=${data[key]}\n`;
                        return acc;
                    }, '');
                    break;
                case 'sh':
                default:
                    return Object.keys(data).reduce((acc, key) => {
                        acc += `export "${key}=${data[key]}"\n`;
                        return acc;
                    }, '');
                    break;
            }
        });
    }
    stop() {
        const _super = Object.create(null, {
            stop: { get: () => super.stop }
        });
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            debug('stopping %s', this.key);
            yield _super.stop.call(this);
            if (!this.parent)
                yield fs_1.promises.unlink(this.params.envFile);
        });
    }
}
exports.EnvMonitor = EnvMonitor;
//# sourceMappingURL=base.js.map