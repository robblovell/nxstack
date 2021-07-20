import { ResourceHelper } from '@c6o/kubeclient-contracts'
import { HubClient } from '@c6o/common'
import { createDebug } from '@c6o/logger'
import { AppResource, ResolverParams, Resolver as ResolverContract, ProvisionerBase as ProvisionerBase } from '@provisioner/contracts'
import { AppHelper } from '@provisioner/common'
import { ProvisionerFactory } from './factory'
import { AppAdapter } from './adapter'

const debug = createDebug()

export class Resolver implements ResolverContract {

    _provisionerFactory: ProvisionerFactory
    get provisionerFactory() {
        if (this._provisionerFactory)
            return this._provisionerFactory
        this._provisionerFactory = new ProvisionerFactory()
        this._provisionerFactory.status = this.adapter.status
        return this._provisionerFactory
    }

    constructor(private adapter: AppAdapter) { }

    async getProvisioner<T extends ProvisionerBase>(nameSpaceOrParamsOrResource: string | AppResource | ResolverParams, nameOrServiceName?: string): Promise<T> {

        // If we have a namespace, check that we also have an app name
        if (typeof nameSpaceOrParamsOrResource === 'string' &&
            (!nameOrServiceName  || typeof nameOrServiceName !== 'string'))
            throw new Error(`Cannot determine provisioner for namespace ${nameOrServiceName} because the app name was not provided or is the wrong type`)

        // Collapse the various inputs into an appResource
        const appResource: AppResource =
            ResourceHelper.isResource(nameSpaceOrParamsOrResource) ?
                // We were passed in a resource
                nameSpaceOrParamsOrResource :
                typeof nameSpaceOrParamsOrResource === 'string' ?
                    // We are passed in a string (have to be 2 strings)
                    await AppHelper
                        .from(nameSpaceOrParamsOrResource, nameOrServiceName) // nameOrServiceName is required if nameSpaceOrParamsOrResource is a string
                        .read(this.adapter.cluster) :
                    // Assume we're passed in params
                    await this.paramsToAppResource(nameSpaceOrParamsOrResource)

        // Set the adapter document if not already set
        // This is important because, sometimes, the adapter
        // is constructed using manager.loadAdapter('App') instead
        // of a Resource so the document would not be set
        if (!this.adapter.resource)
            this.adapter.resource = appResource

        const appHelper = new AppHelper(appResource)
        const serviceName = (nameSpaceOrParamsOrResource as ResolverParams).serviceName || nameOrServiceName || appHelper.name
        const npmPackage = appHelper.getServicePackage(serviceName) || `@provisioner/${serviceName}`
        const provisioner = await this.provisionerFactory.createProvisioner(npmPackage) as T

        // Initialize the provisioner
        provisioner.controller = this.adapter
        provisioner.serviceName = serviceName

        return provisioner
    }

    async paramsToAppResource(params: ResolverParams): Promise<AppResource> {
        params.edition = params.edition || 'latest'

        let appManifest
        if (params.namespace) {
            try {
                appManifest = await AppHelper
                    .from(params.namespace, params.appName)
                    .read(this.adapter.cluster)
            } catch (ex) {
                // Fail silently and try hub
                debug('Could not get manifest from cluster, trying hub %o', ex)
            }
        }
        if (!appManifest) {
            const hubClient = new HubClient()
            if (params.hubToken)
                await hubClient.init(params.hubToken)
            appManifest = await hubClient.getAppEditionManifest(params.appName, params.edition) as AppResource
        }

        if (!appManifest)
            throw new Error(`Could not resolve app resource for ${params.appName}`)

        return appManifest
    }
}