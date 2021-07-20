"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertEditions = exports.loadLocalAppResources = exports.loadLocalAppManifests = exports.convertManifestToAppResource = void 0;
const parser_1 = require("./parser");
const convertManifestToAppResource = (manifest, edition) => {
    const appResource = {
        apiVersion: 'system.codezero.io/v1',
        kind: 'App',
        metadata: {
            name: manifest.namespace || manifest.appId,
            labels: {
                'system.codezero.io/edition': edition.name
            },
            'annotations': {
                'system.codezero.io/display': manifest.name,
                'system.codezero.io/description': manifest.summary || manifest.description,
                'system.codezero.io/appId': manifest._id || manifest.appId,
                'system.codezero.io/iconUrl': manifest.iconUrl
            }
        },
        spec: Object.assign({ package: manifest.package }, edition.spec)
    };
    if (edition.interfaces) {
        edition.interfaces.forEach(item => {
            appResource.metadata.labels = Object.assign(Object.assign({}, appResource.metadata.labels), { [`system.codezero.io/interface-${item}`]: 'true' });
        });
    }
    return appResource;
};
exports.convertManifestToAppResource = convertManifestToAppResource;
const loadLocalAppManifests = (manifest) => {
    return parser_1.parseManifest(manifest, null, {
        rootFile: 'c6o.yaml',
        rootFolder: 'c6o/',
        folderFile: 'app.yaml'
    });
};
exports.loadLocalAppManifests = loadLocalAppManifests;
const loadLocalAppResources = (manifest) => {
    const contents = exports.loadLocalAppManifests(manifest);
    if (Array.isArray(contents)) {
        return contents.map((content) => exports.convertEditions(content, manifest)[0]);
    }
    else {
        return exports.convertEditions(contents, manifest);
    }
};
exports.loadLocalAppResources = loadLocalAppResources;
const convertEditions = (content, manifest) => {
    var _a;
    if (!content.editions.length) {
        throw new Error(`No available editions found in ${manifest}.`);
    }
    return (_a = content.editions) === null || _a === void 0 ? void 0 : _a.map(edition => exports.convertManifestToAppResource(content, edition));
};
exports.convertEditions = convertEditions;
//# sourceMappingURL=manifest.js.map