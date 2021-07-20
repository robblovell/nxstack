import { Namespace } from '@c6o/kubeclient-resources/core/v1'
import { createDebug } from '@c6o/logger'
import { Cluster, PatchOp, Status } from '@c6o/kubeclient-contracts'
import { actionType, AppHelper, AppResource, AppStatuses, ProvisionerBase, stageType } from '@provisioner/contracts'
import { SystemProvisioner } from '@provisioner/c6o-system'
import { NamespacedAdapter } from '../contracts'
import { NamespacedAdapterHelper } from '../namespace'
import { Resolver } from './resolver'

const debug = createDebug()

type provisionMethods = (...args: any) => Promise<void>

export interface AppAdapterOptions {
    cluster: Cluster
    action?: actionType
    stage?: stageType
    status?: Status
}

const FINALIZER = 'finalizer.app.codezero.io'
export class AppAdapter implements NamespacedAdapter<AppResource> {
    // The following need to pass in during construction
    get status() { return this.options.status }
    get cluster() { return this.options.cluster }
    get action() { return this.options.action }
    get stage() { return this.options.stage }

    // The app namespace
    namespace: Namespace
    namespaceHelper: NamespacedAdapterHelper<AppResource>

    resolver: Resolver

    provisioners: Array<ProvisionerBase> = []

    constructor(protected options: AppAdapterOptions, public resource?: AppResource) {
        this.namespaceHelper = new NamespacedAdapterHelper(this)
        this.resolver = new Resolver(this)
    }

    async ensureAppCRD() {
        if ((await this.cluster.version()).gte('1.16.0'))
            await this.cluster
                .begin('Provision c6o CRDs for apiextensions.k8s.io/v1')
                .upsertFile('../../../k8s/crds/apps.v1.yaml')
                .end()
        else
            await this.cluster
                .begin('Provision c6o CRDs for apiextensions.k8s.io/v1beta1')
                .upsertFile('../../../k8s/crds/apps.v1beta1.yaml')
                .end()
    }

    async load() {
        if (this.resource.kind !== 'App')
            throw new Error(`Expected spec of type App but got ${this.resource.kind}`)

        if (this.resource.spec.provisioner === 'ignore')
            return

        const appHelper = new AppHelper(this.resource)

        for (const serviceObject of appHelper.services) {
            const serviceName = appHelper.getServiceName(serviceObject)
            this.options.status?.push(`Prepare ${this.options.action} service ${serviceName}`)
            // Check if service has been skipped in the options
            if (!serviceObject.skip) {
                const provisioner = await this.resolver.getProvisioner(this.resource, serviceName) as ProvisionerBase
                provisioner.spec = appHelper.getServiceSpec(serviceName)
                this.provisioners.push(provisioner)
                this.options.status?.pop()
            }
            else
                this.options.status?.pop(true)
        }
    }

    async inquire(options) {
        switch (this.options.action) {
            case 'create':
                await this.namespaceHelper.inquireAppNamespace(options)
                break
        }

        await this.doAll('Inquiring', options)
    }

    async validate() {
        await this.namespaceHelper.validateAppNamespace()
        await this.doAll('Validating')
    }

    async preApply() {
        switch (this.options.action) {
            case 'create':
                await this.preCreateApplyNamespaces()
                await this.ensureAppCRD()
                break
            case 'remove':
                // TODO: should I update document here?
                break
        }
    }

    async preCreateApplyNamespaces() {
        // Ensure the App Namespace
        await this.namespaceHelper.ensureAppNamespace()

        for (const provisioner of this.provisioners) {
            // Services can have their own namespaces. These are defined in the spec section
            const namespace = provisioner.spec.namespace?.spec || provisioner.spec.namespace
            const namespaceResource = await this.namespaceHelper.ensureNamespace(namespace)
            provisioner.serviceNamespace = namespaceResource.metadata.name
        }
    }

    async apply() {
        // If we're in here, we've entered the critical section
        await this.doAll('Applying')

        // Post apply
        switch (this.options.action) {
            case 'create':
                this.addFinalizer(this.resource)
                this.addLastAppliedConfig(this.resource)
                await this.systemPostCreateApp(this.resource)
                break
            case 'update':
                this.addLastAppliedConfig(this.resource)
                await this.systemPostUpdateApp(this.resource)
                break
            case 'remove':
                await this.systemPostRemoveApp(this.resource)
                await this.removeFinalizer(this.resource)
                break
        }
    }

    async toPending(resource: AppResource): Promise<void> {
        const pendingStatus = AppStatuses[this.options.action].Pending
        // Only allow changes to the status
        if (resource.status === pendingStatus)
            throw new Error(`Cannot modify App status to ${pendingStatus} because it is already in ${pendingStatus}`)
        resource.status = pendingStatus
    }

    async toComplete(/* resource: AppDocument */): Promise<PatchOp> {
        // We don't care what the current status is in this case
        const completeStatus = AppStatuses[this.options.action].Completed
        return { op: 'replace', path: '/status', value: completeStatus }
    }

    async toError(/* resource: AppDocument */): Promise<Partial<AppResource>> {
        const errorStatus = AppStatuses[this.options.action].Error
        return { status: errorStatus }
    }

    async error(/* resource: AppDocument */) {
        // We do nothing right now to recover from errors
        return false
    }

    addFinalizer(appSpec: AppResource) {
        if (appSpec.spec.provisioner?.finalizer === false) {
            this.options.status?.warn('Finalizers skipped as requested! Hope you know what you are doing')
            return
        }

        if (!appSpec.metadata)
            appSpec.metadata = {}
        if (!appSpec.metadata.finalizers) {
            appSpec.metadata.finalizers = [FINALIZER]
            return
        }

        if (appSpec.metadata.finalizers.findIndex(f => f === FINALIZER) < 0)
            appSpec.metadata.finalizers.push(FINALIZER)
    }

    async removeFinalizer(appSpec) {
        if (!appSpec.metadata?.finalizers)
            return

        appSpec.metadata.finalizers = appSpec.metadata?.finalizers.filter(f => f !== FINALIZER)
    }

    addLastAppliedConfig(appSpec) {
        appSpec.metadata.annotations['system.codezero.io/last-running-revision'] = appSpec.metadata.resourceVersion
    }

    async systemPostCreateApp(appSpec) {
        this.options.status?.push('Running system post-app create')
        const systemProvisioner = await this.resolver.getProvisioner<SystemProvisioner>('c6o-system', 'c6o-system')
        await systemProvisioner.postCreateApp(appSpec)
        this.options.status?.pop()
    }

    async systemPostUpdateApp(appSpec) {
        this.options.status?.push('Running system post-app update')
        const systemProvisioner = await this.resolver.getProvisioner<SystemProvisioner>('c6o-system', 'c6o-system')
        await systemProvisioner.postUpdateApp(appSpec)
        this.options.status?.pop()
    }

    async systemPostRemoveApp(appSpec) {
        this.options.status?.push('Running system post-app remove')
        const systemProvisioner = await this.resolver.getProvisioner<SystemProvisioner>('c6o-system', 'c6o-system')
        await systemProvisioner.postRemoveApp(appSpec)
        this.options.status?.pop()
    }

    async doAll(title?: string, ...args: any) {
        // stages are inquire, validate, apply
        const stageCap = this.stage.charAt(0).toUpperCase() + this.stage.slice(1)
        // if documentKind is empty, we assume it is an app
        const documentKind = this.resource.kind === 'App' ? '' : this.resource.kind
        // createInquire, createTaskInquire, createApply, createTaskApply, etc..
        const operation = `${this.action}${documentKind}${stageCap}`

        for (const provisioner of this.provisioners) {
            const func: provisionMethods = provisioner[operation]

            if (!func) {
                if (process.env.NODE_ENV === 'development')
                    this.status?.warn(`Skipping ${operation} on service ${provisioner.serviceName}`)
                continue
            }

            if (typeof func != 'function')
                throw Error(`Cannot call function ${operation} on provisioner for service ${provisioner.serviceName}`)

            if (title)
                this.status?.push(`${title} ${provisioner.serviceName}`)

            await func.apply(provisioner, args)

            if (title)
                this.status?.pop()
        }
    }
}
