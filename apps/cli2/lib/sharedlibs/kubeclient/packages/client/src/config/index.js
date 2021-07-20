"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KubeConfig = exports.Config = void 0;
const tslib_1 = require("tslib");
const fs = tslib_1.__importStar(require("fs"));
const net = tslib_1.__importStar(require("net"));
const path = tslib_1.__importStar(require("path"));
const yaml = tslib_1.__importStar(require("js-yaml"));
const types_1 = require("./types");
function fileExists(filepath) {
    try {
        fs.accessSync(filepath);
        return true;
    }
    catch (ignore) { }
    return false;
}
class Config {
}
exports.Config = Config;
Config.SERVICEACCOUNT_ROOT = '/var/run/secrets/kubernetes.io/serviceaccount';
Config.SERVICEACCOUNT_CA_PATH = Config.SERVICEACCOUNT_ROOT + '/ca.crt';
Config.SERVICEACCOUNT_TOKEN_PATH = Config.SERVICEACCOUNT_ROOT + '/token';
class KubeConfig {
    constructor() {
        this.contexts = [];
        this.clusters = [];
        this.users = [];
    }
    getContexts() {
        return this.contexts;
    }
    getClusters() {
        return this.clusters;
    }
    getUsers() {
        return this.users;
    }
    getCurrentContext() {
        return this.currentContext;
    }
    setCurrentContext(context) {
        this.currentContext = context;
    }
    getContextObject(name) {
        if (!this.contexts)
            return null;
        return findObject(this.contexts, name, 'context');
    }
    getCurrentCluster() {
        const context = this.getCurrentContextObject();
        if (!context)
            return null;
        return this.getCluster(context.cluster);
    }
    getCluster(name) {
        return findObject(this.clusters, name, 'cluster');
    }
    getCurrentUser() {
        const ctx = this.getCurrentContextObject();
        if (!ctx) {
            return null;
        }
        return this.getUser(ctx.user);
    }
    getUser(name) {
        return findObject(this.users, name, 'user');
    }
    loadFromFile(file) {
        const rootDirectory = path.dirname(file);
        this.loadFromString(fs.readFileSync(file, 'utf8'));
        this.makePathsAbsolute(rootDirectory);
    }
    applytoHTTPSOptions(opts) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const user = this.getCurrentUser();
            yield this.applyOptions(opts);
            if (user && user.username) {
                opts.auth = `${user.username}:${user.password}`;
            }
        });
    }
    applyToRequest(opts) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const cluster = this.getCurrentCluster();
            const user = this.getCurrentUser();
            yield this.applyOptions(opts);
            if (cluster && cluster.skipTLSVerify) {
                opts.strictSSL = false;
            }
            if (user && user.username) {
                opts.auth = {
                    password: user.password,
                    username: user.username,
                };
            }
        });
    }
    loadFromString(config) {
        const obj = yaml.load(config);
        this.clusters = types_1.newClusters(obj.clusters);
        this.contexts = types_1.newContexts(obj.contexts);
        this.users = types_1.newUsers(obj.users);
        this.currentContext = obj['current-context'];
    }
    loadFromOptions(options) {
        this.clusters = options.clusters;
        this.contexts = options.contexts;
        this.users = options.users;
        this.currentContext = options.currentContext;
    }
    loadFromClusterAndUser(cluster, user) {
        this.clusters = [cluster];
        this.users = [user];
        this.currentContext = 'loaded-context';
        this.contexts = [
            {
                cluster: cluster.name,
                user: user.name,
                name: this.currentContext,
            },
        ];
    }
    loadFromCluster(pathPrefix = '') {
        const host = process.env.KUBERNETES_SERVICE_HOST;
        const port = process.env.KUBERNETES_SERVICE_PORT;
        const clusterName = 'inCluster';
        const userName = 'inClusterUser';
        const contextName = 'inClusterContext';
        let scheme = 'https';
        if (port === '80' || port === '8080' || port === '8001') {
            scheme = 'http';
        }
        let serverHost = host;
        if (host && net.isIPv6(host)) {
            serverHost = `[${host}]`;
        }
        this.clusters = [
            {
                name: clusterName,
                caFile: `${pathPrefix}${Config.SERVICEACCOUNT_CA_PATH}`,
                server: `${scheme}://${serverHost}:${port}`,
                skipTLSVerify: false,
            },
        ];
        this.users = [
            {
                name: userName,
                authProvider: {
                    name: 'tokenFile',
                    config: {
                        tokenFile: `${pathPrefix}${Config.SERVICEACCOUNT_TOKEN_PATH}`,
                    },
                },
            },
        ];
        this.contexts = [
            {
                cluster: clusterName,
                name: contextName,
                user: userName,
            },
        ];
        this.currentContext = contextName;
    }
    mergeConfig(config) {
        this.currentContext = config.currentContext;
        config.clusters.forEach((cluster) => {
            this.addCluster(cluster);
        });
        config.users.forEach((user) => {
            this.addUser(user);
        });
        config.contexts.forEach((ctx) => {
            this.addContext(ctx);
        });
    }
    addCluster(cluster) {
        if (!this.clusters) {
            this.clusters = [];
        }
        this.clusters.forEach((c, ix) => {
            if (c.name === cluster.name) {
                throw new Error(`Duplicate cluster: ${c.name}`);
            }
        });
        this.clusters.push(cluster);
    }
    addUser(user) {
        if (!this.users) {
            this.users = [];
        }
        this.users.forEach((c, ix) => {
            if (c.name === user.name) {
                throw new Error(`Duplicate user: ${c.name}`);
            }
        });
        this.users.push(user);
    }
    addContext(ctx) {
        if (!this.contexts) {
            this.contexts = [];
        }
        this.contexts.forEach((c, ix) => {
            if (c.name === ctx.name) {
                throw new Error(`Duplicate context: ${c.name}`);
            }
        });
        this.contexts.push(ctx);
    }
    loadFromDefault() {
        if (process.env.KUBECONFIG && process.env.KUBECONFIG.length > 0) {
            const files = process.env.KUBECONFIG.split(path.delimiter);
            this.loadFromFile(files[0]);
            for (let i = 1; i < files.length; i++) {
                const kc = new KubeConfig();
                kc.loadFromFile(files[i]);
                this.mergeConfig(kc);
            }
            return;
        }
        const home = findHomeDir();
        if (home) {
            const config = path.join(home, '.kube', 'config');
            if (fileExists(config)) {
                this.loadFromFile(config);
                return;
            }
        }
        if (fileExists(Config.SERVICEACCOUNT_TOKEN_PATH)) {
            this.loadFromCluster();
            return;
        }
        this.loadFromClusterAndUser({ name: 'cluster', server: 'http://localhost:8080' }, { name: 'user' });
    }
    makePathsAbsolute(rootDirectory) {
        this.clusters.forEach((cluster) => {
            if (cluster.caFile) {
                cluster.caFile = makeAbsolutePath(rootDirectory, cluster.caFile);
            }
        });
        this.users.forEach((user) => {
            if (user.certFile) {
                user.certFile = makeAbsolutePath(rootDirectory, user.certFile);
            }
            if (user.keyFile) {
                user.keyFile = makeAbsolutePath(rootDirectory, user.keyFile);
            }
        });
    }
    exportConfig() {
        const configObj = {
            apiVersion: 'v1',
            kind: 'Config',
            clusters: this.clusters.map(types_1.exportCluster),
            users: this.users.map(types_1.exportUser),
            contexts: this.contexts.map(types_1.exportContext),
            preferences: {},
            'current-context': this.getCurrentContext(),
        };
        return JSON.stringify(configObj);
    }
    getCurrentContextObject() {
        return this.getContextObject(this.currentContext);
    }
    applyHTTPSOptions(opts) {
        const cluster = this.getCurrentCluster();
        const user = this.getCurrentUser();
        if (!user) {
            return;
        }
        if (cluster != null && cluster.skipTLSVerify)
            opts.rejectUnauthorized = false;
        const ca = cluster != null ? bufferFromFileOrString(cluster.caFile, cluster.caData) : null;
        if (ca)
            opts.ca = ca;
        const cert = bufferFromFileOrString(user.certFile, user.certData);
        if (cert)
            opts.cert = cert;
        const key = bufferFromFileOrString(user.keyFile, user.keyData);
        if (key)
            opts.key = key;
    }
    applyAuthorizationHeader(opts) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const user = this.getCurrentUser();
            if (!user)
                return;
            const authenticator = KubeConfig.authenticators.find((elt) => elt.isAuthProvider(user));
            if (!opts.headers)
                opts.headers = {};
            if (authenticator)
                yield authenticator.applyAuthentication(user, opts);
            if (user.token)
                opts.headers.Authorization = `Bearer ${user.token}`;
        });
    }
    applyOptions(opts) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            this.applyHTTPSOptions(opts);
            yield this.applyAuthorizationHeader(opts);
        });
    }
}
exports.KubeConfig = KubeConfig;
KubeConfig.authenticators = [];
function makeAbsolutePath(root, file) {
    if (!root || path.isAbsolute(file))
        return file;
    return path.join(root, file);
}
function bufferFromFileOrString(file, data) {
    if (file) {
        return fs.readFileSync(file);
    }
    if (data) {
        return Buffer.from(data, 'base64');
    }
    return null;
}
function findHomeDir() {
    if (process.env.HOME) {
        try {
            fs.accessSync(process.env.HOME);
            return process.env.HOME;
        }
        catch (ignore) { }
    }
    if (process.platform !== 'win32')
        return null;
    if (process.env.HOMEDRIVE && process.env.HOMEPATH) {
        const dir = path.join(process.env.HOMEDRIVE, process.env.HOMEPATH);
        try {
            fs.accessSync(dir);
            return dir;
        }
        catch (ignore) { }
    }
    if (process.env.USERPROFILE) {
        try {
            fs.accessSync(process.env.USERPROFILE);
            return process.env.USERPROFILE;
        }
        catch (ignore) { }
    }
    return null;
}
function findObject(list, name, key) {
    if (!list) {
        return null;
    }
    for (const obj of list) {
        if (obj.name === name) {
            if (obj[key]) {
                obj[key].name = name;
                return obj[key];
            }
            return obj;
        }
    }
    return null;
}
//# sourceMappingURL=index.js.map