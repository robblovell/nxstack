import { createDebug } from '@c6o/logger'
import { Status } from '@c6o/kubeclient-contracts'
import { PluginManager, PluginManagerOptions } from 'live-plugin-manager'
import * as path from 'path'

const debug = createDebug()
const provisionersFolder = '../../../.provisioners'

export class ProvisionerFactory {
    // TODO: Debt - find a way to inject in a status with a ProvisionerManager assigned
    status: Status

    private _pluginManager: PluginManager
    private get pluginManager() {
        if (this._pluginManager)
            return this._pluginManager

        const pluginOptions: Partial<PluginManagerOptions> = {
            pluginsPath: path.resolve(__dirname, provisionersFolder)
        }

        // Can override the default of https://registry.npmjs.org
        if (process.env.NPM_REGISTRY_URL)
            pluginOptions.npmRegistryUrl = process.env.NPM_REGISTRY_URL
        if (process.env.NPM_REGISTRY_TOKEN)
            pluginOptions.npmRegistryConfig = { auth: { token: process.env.NPM_REGISTRY_TOKEN } }
        else if (process.env.NPM_REGISTRY_USERNAME && process.env.NPM_REGISTRY_PASSWORD)
            pluginOptions.npmRegistryConfig = { auth: { username: process.env.NPM_REGISTRY_USERNAME, password: process.env.NPM_REGISTRY_PASSWORD } }

        if (process.env.NODE_ENV == 'development') {
            // This is so we don't have to quit and start
            pluginOptions.npmInstallMode = 'noCache'
        }
        debug('plugin options %o', pluginOptions)
        return this._pluginManager = new PluginManager(pluginOptions)
    }

    createProvisioner = async (npmPackage) => {
        this.status?.push(`Load ${npmPackage}`)

        const result =
            await this.getLocalProvisioner(npmPackage) ||
            await this.getRegistryProvisioner(npmPackage)

        if (!result)
            throw new Error(`Failed to load ${npmPackage}`)

        this.status?.pop()

        const { module, location } = result

        const { Provisioner } = module
        const provisioner = new Provisioner()
        provisioner.moduleLocation = location

        return provisioner
    }

    getRegistryProvisioner = async (module: string) => {
        try {
            let response = await this.pluginManager.getInfo(module)
            debug(`getInfo response for ${module} %o`, response)

            if (!response) {
                this.status?.info(`Installing provisioner ${module}`)
                response = await this.pluginManager.install(module)
                debug('install response', response)
            } else
                this.status?.info(`Using cached provisioner for ${module}`)

            const result = { module: this.pluginManager.require(module), location: response.location }
            debug(`LOADED ${module} from registry to ${result.location}`)

            return result

        }
        catch(ex) {
            debug(`ERROR retrieving module from remote repository ${module} %o`, ex)
        }
        return null
    }

    getLocalProvisioner = async (npmPackage: string) => {
        try {
            const result = {
                module: await import(npmPackage),
                // The following ensures we get the root location of the package
                location: path.dirname(require.resolve(`${npmPackage}/package.json`))
            }
            debug(`LOADED ${npmPackage} from local at ${result.location}`)

            return result
        }
        catch (ex) {
            debug(`ERROR retrieving module from local repository ${npmPackage}`)
        }
        return null
    }
}
