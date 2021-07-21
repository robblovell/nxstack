import { Deployment } from '@c6o/kubeclient-resources/apps/v1'
import { PatchOps, Processor, Result, toResourceId } from '@c6o/kubeclient-contracts'
import { ConfigMap, Service, ServiceSpec } from '@c6o/kubeclient-resources/core/v1'
import { DeploymentHelper } from '@provisioner/common'
import { createDebug } from '@c6o/logger'
import { ServiceHelper } from '@provisioner/contracts'
import { ClusterSessionService } from '../session'
import { ServiceProxyParams } from './params'
import { projectBaseDir } from '../base'

const debug = createDebug()

const pathToMultiDecoyConfig = `${projectBaseDir}/k8s/proxies/nginx/config-multi-decoy.yaml`
const pathToDeploy = `${projectBaseDir}/k8s/proxies/nginx/deploy.yaml`

const interceptorServiceTemplate = (namespace, name, port: number, signatureHash: string): Service => ({
    apiVersion: 'v1',
    kind: 'Service',
    metadata: {
        name,
        namespace,
        labels: {
            app: 'interceptor',
            'system.codezero.io/session': signatureHash,
        }
    },
    spec: {
        type: 'NodePort',
        ports: [{
            protocol: 'TCP',
            port,
            targetPort: 80,
        }],
        selector: {
            app: 'interceptor',
            'system.codezero.io/session': signatureHash,
        }
    }
})

interface ServiceRestore {
    service: Service
    ops: PatchOps
}

interface HeaderRoute {
    value: string
    location: string
    uid: string
}

const defaultHeaderKey = 'x_c6o_intercept'
const defaultHeaderValue = 'yes'

export class NGINXServiceProxy extends ClusterSessionService<ServiceProxyParams> {
    static cleanUpKeys = ['decoy-service', 'service', 'deploy', 'config', 'restore-service']

    get signature() { return `intercept-${this.params.namespace}-${this.params.remoteService}` }
    get decoyServiceName() { return `interceptor-${this.params.remoteService}-decoy` }
    get interceptName()  { return `interceptor-${this.params.remoteService}` }

    get addDecoy() { return !this.params.allTraffic }

    async sessionInProgress() {
        // We support multiple NGINX sessions
        // TODO: Preform pre-condition checks here instead of in exec
        return false
    }

    async executeCleanup() {
        if (await this.removeRoute())
            return false

        // Tear it all down
        const cluster = this.params.cluster
        const cleanupProcessor = cluster.begin(`Removing intercept for ${this.params.remoteService} in ${this.params.namespace}`)

        const service = await this.session.get<Service>('service')
        if (service)
            cleanupProcessor.delete(service)

        const decoyService = await this.session.get<Service>('decoy-service')
        if (decoyService)
            cleanupProcessor.delete(decoyService)

        const deploy = await this.session.get<Deployment>('deploy')
        if (deploy)
            cleanupProcessor.delete(deploy)

        const restoreService = await this.session.get<ServiceRestore>('restore-service')
        if (restoreService)
            cleanupProcessor.patch(restoreService.service, restoreService.ops)

        const config = await this.session.get<ConfigMap>('config')
        if (config)
            cleanupProcessor.delete(config)

        await cleanupProcessor.end()
        return true
    }

    private async removeRoute() {
        const currentRoutes = await this.session.get<HeaderRoute[]>('routes') || [] as HeaderRoute[]
        const uid = await this.sessionUserId()
        const routes = currentRoutes.filter(route => route.uid !== uid)

        if (routes.length) {
            // We still have remaining routes
            // Just update the routes and leave the service alone
            await this.updateRoutes(routes)
            return true
        }
        return false
    }

    private async addRoute() {
        const currentRoutes = await this.session.get<HeaderRoute[]>('routes') || [] as HeaderRoute[]
        const alreadyHadRoutes = !!currentRoutes.length

        const value = this.headerValue
        if (alreadyHadRoutes) {
            await this.validateHeaderKey()

            if (currentRoutes.some(item => item.value === value))
                throw new Error(`Cannot intercept using header value '${value}' as it is already in use. Please try another intercept header value.`)
        }

        currentRoutes.push({
            value,
            location: this.getUpstreamLocation(),
            uid: await this.sessionUserId()
        })

        await this.updateRoutes(currentRoutes, alreadyHadRoutes)
        return alreadyHadRoutes
    }

    private async updateRoutes(routes: HeaderRoute[], isPatch = true) {
        const {
            cluster,
            namespace,
            remoteService,
            remotePort
        } = this.params

        const headerKey = isPatch ?
            await this.session.get<string>('header-key') :
            this.headerKey

        await cluster.begin(`Updating routes for ${remoteService} in ${namespace}`)
            .upsertFile(pathToMultiDecoyConfig, {
                signatureHash: this.session.signatureHash,
                interceptName: this.interceptName,
                interceptNamespace: namespace,
                decoyServicePort: remotePort,
                decoyServiceName: this.decoyServiceName,
                headerKey,
                routes
            })
            .do(async (result) => {
                if (isPatch)
                    await DeploymentHelper.from(this.params.namespace, this.interceptName).restart(cluster)
                else
                    await this.stash('config')(result)
            })
            .end()

        await this.session.set('routes', routes)
    }

    async execute() {
        const {
            namespace,
            remoteService,
            remotePort
        } = this.params

        debug('Creating cluster')
        const cluster = this.params.cluster

        const result = await cluster.read(this.params.remoteServiceResourceId)
        debug('Fetched service %o', result.object)
        const existingService = result.as<Service>()

        if (await this.addRoute())
            return

        await this.session.set('header-key', this.headerKey)
        await cluster.begin(`Adding intercept for ${remoteService} in ${namespace}`)
            .upsertFile(pathToDeploy, {
                signatureHash: this.session.signatureHash,
                interceptName: this.interceptName,
                interceptNamespace: namespace,
                interceptConfName: this.interceptName
            })
            .do(this.stash('deploy'))
            .do(async (_, processor) => {
                const interceptorService = interceptorServiceTemplate(namespace, remoteService, remotePort, this.session.signatureHash)
                if (existingService)
                    this.patchServiceSpec(processor, existingService, interceptorService.spec)
                else
                    processor
                        .create(interceptorService)
                        .do(this.stash('service'))
            })
            .end()
    }

    private getUpstreamLocation(): string {
        const upstreamURL = new URL(this.params.upstreamURL)
        return upstreamURL.port ? `${upstreamURL.host}:${upstreamURL.port}` : upstreamURL.host
    }

    private async validateHeaderKey() {
        const currentHeaderKey = await this.session.get('header-key')
        if (!currentHeaderKey) return

        const headerKey = this.headerKey
        if (headerKey !== currentHeaderKey)
            throw new Error(`The current header intercept for this service is ${currentHeaderKey}. Cannot intercept using ${headerKey}. Please close all other intercepts.`)

    }

    private get headerKey(): string {
        if (this.params.header?.includes(':')) {
            const values = this.params.header?.split(':')
            return values[0].toLowerCase().replace(/-/g, '_')
        }
        return defaultHeaderKey
    }

    private get headerValue(): string {
        if (this.params.header?.includes(':')) {
            const values = this.params.header?.split(':')
            return values[1].toLowerCase()
        }
        return defaultHeaderValue
    }

    private createDecoy(service: Service) {
        const decoyService = ServiceHelper.from(service.metadata.namespace, this.decoyServiceName).resource
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { ports, selector, type, ...rest } = service.spec
        decoyService.spec = {
            selector,
            ports: ports.map(port => {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { nodePort, ...rest } = port
                return rest
            }),
            type
        }
        return decoyService
    }

    private async patchServiceSpec(processor: Processor, service: Service, spec: ServiceSpec) {
        if (this.addDecoy)
            processor
                .create(this.createDecoy(service))
                .do(this.stash('decoy-service'))

        processor
            .patch(service, [
                { op: 'replace', path: '/spec/selector', value: spec.selector },
                { op: 'replace', path: '/spec/ports', value: spec.ports }
            ] as any)
            .do(async () =>
                await this.session.set('restore-service', this.restoration(service))
            )
    }

    stash = (config: string) => async (result: Result) =>
        await this.session.set(config, toResourceId(result.object))

    private restoration(service: Service): ServiceRestore {
        const { apiVersion, kind } = service
        const { name, namespace } = service.metadata
        return {
            service: {
                kind,
                apiVersion,
                metadata: {
                    namespace,
                    name
                }
            },
            ops: [
                { op: 'replace', path: '/spec/selector', value: service.spec.selector },
                { op: 'replace', path: '/spec/ports', value: service.spec.ports }
            ]
        }
    }
}
