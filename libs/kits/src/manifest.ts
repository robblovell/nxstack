import { parseManifest } from './parser'

export const convertManifestToAppResource = (manifest, edition) => {
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
                //'system.codezero.io/screenshotUrls': await getAssetUrls(app.assets, assetProperties['screenshot'].multi, 'apps', czApp._id, 'screenshot', assetProperties)
            }
        },
        spec: {
            package: manifest.package,
            ...edition.spec
        }
    }
    if (edition.interfaces) {
        edition.interfaces.forEach(item => {
            appResource.metadata.labels = {
                ...appResource.metadata.labels,
                [`system.codezero.io/interface-${item}`]: 'true'
            }
        })
    }
    return appResource
}

export const loadLocalAppManifests = (manifest): any => {
    return parseManifest(manifest, null, {
        rootFile: 'c6o.yaml',
        rootFolder: 'c6o/',
        folderFile: 'app.yaml'
    })
}


export const loadLocalAppResources = (manifest): Array<any> => {
    const contents = loadLocalAppManifests(manifest)

    if (Array.isArray(contents)) { // an array of apps.
        return contents.map((content) => convertEditions(content, manifest)[0])
    } else { // a single app.
        return convertEditions(contents, manifest)
    }
}

export const convertEditions = (content, manifest) => {
    if (!content.editions.length) {
        throw new Error(`No available editions found in ${manifest}.`)
    }
    return content.editions?.map(edition => convertManifestToAppResource(content, edition))
}