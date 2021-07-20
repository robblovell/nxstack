"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProvisionerFactory = void 0;
const tslib_1 = require("tslib");
const logger_1 = require("@c6o/logger");
const live_plugin_manager_1 = require("live-plugin-manager");
const path = tslib_1.__importStar(require("path"));
const debug = logger_1.createDebug();
const provisionersFolder = '../../../.provisioners';
class ProvisionerFactory {
    constructor() {
        this.createProvisioner = (npmPackage) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            (_a = this.status) === null || _a === void 0 ? void 0 : _a.push(`Load ${npmPackage}`);
            const result = (yield this.getLocalProvisioner(npmPackage)) ||
                (yield this.getRegistryProvisioner(npmPackage));
            if (!result)
                throw new Error(`Failed to load ${npmPackage}`);
            (_b = this.status) === null || _b === void 0 ? void 0 : _b.pop();
            const { module, location } = result;
            const { Provisioner } = module;
            const provisioner = new Provisioner();
            provisioner.moduleLocation = location;
            return provisioner;
        });
        this.getRegistryProvisioner = (module) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            var _c, _d;
            try {
                let response = yield this.pluginManager.getInfo(module);
                debug(`getInfo response for ${module} %o`, response);
                if (!response) {
                    (_c = this.status) === null || _c === void 0 ? void 0 : _c.info(`Installing provisioner ${module}`);
                    response = yield this.pluginManager.install(module);
                    debug('install response', response);
                }
                else
                    (_d = this.status) === null || _d === void 0 ? void 0 : _d.info(`Using cached provisioner for ${module}`);
                const result = { module: this.pluginManager.require(module), location: response.location };
                debug(`LOADED ${module} from registry to ${result.location}`);
                return result;
            }
            catch (ex) {
                debug(`ERROR retrieving module from remote repository ${module} %o`, ex);
            }
            return null;
        });
        this.getLocalProvisioner = (npmPackage) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                const result = {
                    module: yield Promise.resolve().then(() => tslib_1.__importStar(require(npmPackage))),
                    location: path.dirname(require.resolve(`${npmPackage}/package.json`))
                };
                debug(`LOADED ${npmPackage} from local at ${result.location}`);
                return result;
            }
            catch (ex) {
                debug(`ERROR retrieving module from local repository ${npmPackage}`);
            }
            return null;
        });
    }
    get pluginManager() {
        if (this._pluginManager)
            return this._pluginManager;
        const pluginOptions = {
            pluginsPath: path.resolve(__dirname, provisionersFolder)
        };
        if (process.env.NPM_REGISTRY_URL)
            pluginOptions.npmRegistryUrl = process.env.NPM_REGISTRY_URL;
        if (process.env.NPM_REGISTRY_TOKEN)
            pluginOptions.npmRegistryConfig = { auth: { token: process.env.NPM_REGISTRY_TOKEN } };
        else if (process.env.NPM_REGISTRY_USERNAME && process.env.NPM_REGISTRY_PASSWORD)
            pluginOptions.npmRegistryConfig = { auth: { username: process.env.NPM_REGISTRY_USERNAME, password: process.env.NPM_REGISTRY_PASSWORD } };
        if (process.env.NODE_ENV == 'development') {
            pluginOptions.npmInstallMode = 'noCache';
        }
        debug('plugin options %o', pluginOptions);
        return this._pluginManager = new live_plugin_manager_1.PluginManager(pluginOptions);
    }
}
exports.ProvisionerFactory = ProvisionerFactory;
//# sourceMappingURL=factory.js.map