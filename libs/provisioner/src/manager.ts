import { EventEmitter } from 'events'
import { Resource, ResourceHelper, Status } from '@c6o/kubeclient-contracts'
import { Cluster } from '@c6o/kubeclient'
import { AppResource, optionFunctionType, signalDocument } from '@provisioner/contracts'
import * as path from 'path'

import { Adapter } from './adapters'
import { TransactionHelper } from './transactions'
import { AppAdapter } from './adapters'
import { HubClient } from '@c6o/common'

export type actionType = 'create' | 'update' | 'remove'
export type stageType = 'load' | 'inquire' | 'validate' | 'apply' | 'done'

export interface ProvisionerManagerOptions {
    cluster?: Cluster
    status?: Status
    hubClient?: HubClient
    noInput?: boolean
}
export class ProvisionerManager extends EventEmitter {
    noInput?: boolean
    cluster: Cluster

    adapter: Adapter<Resource>

    stage: stageType
    action: actionType

    _transactionHelper: TransactionHelper<Resource>
    get transactionHelper() {
        if (this._transactionHelper)
            return this._transactionHelper
        return this._transactionHelper = new TransactionHelper(this.adapter)
    }

    _status: Status
    get status() { return this._status }
    set status(value: Status) {
        this._status = value
        this.cluster.status = value
    }

    constructor(options?: ProvisionerManagerOptions) {
        super()

        this.cluster = options?.cluster || new Cluster()
        this.noInput = options?.noInput
        this.status = options?.status
    }

    setStage(stage: stageType) {
        this.stage = stage
        this.emit(stage, this.adapter.resource)
    }

    loadAdapter(stringOrDocument: Resource | string) {
        const kind = ResourceHelper.isResource(stringOrDocument) ?
                stringOrDocument.kind:
                stringOrDocument

        switch (kind) {
            case 'App':
                this.adapter = new AppAdapter(this, ResourceHelper.isResource(stringOrDocument) ? stringOrDocument as AppResource : undefined)
                break
            default:
                throw new Error(`Adapter for resource ${kind} not found`)
        }
        return this.adapter
    }

    async load(resource: Resource) {
        if (!resource)
            throw new Error('Document is required')

        this.loadAdapter(resource)
        this.setStage('load')
        await this.adapter.load()
    }

    async exec(execService: string, ...execArgs) {
        throw new Error('Exec is temporarily under development')
        /*
        // TODO: getProvisionerModule is deprecated
        const provisioner = await this.getProvisionerModule(execService)
        provisioner.execArgs = execArgs

        // await this.execPreprovision()

        this.status?.push('Executing command')

        await provisioner.exec()
        this.status?.pop()
        */
    }

    async help(command: string, option: optionFunctionType, messages: string[]) {
        // TODO: Fix help
        // await this.init()
        // await this.doAll('help', null, command, option, messages)
    }

    /**
     * Run inquire for doc type, then provisioners' inquire
     */
    async inquire(options?) {
        if (!this.noInput) {
            this.setStage('inquire')
            await this.adapter.inquire(options)
        }
    }

    /**
     * Run validate for doc type, then provisioners' validate
     */
    async validate() {
        this.setStage('validate')
        await this.adapter.validate()
    }

    /**
     * Apply resource to k8s and perform xxxApply using provisioners
     */
    async applyLocal() {
        this.setStage('apply')

        await this.adapter.preApply()
        if (await this.transactionHelper.beginTransaction()) {
            try {
                // The following needs to be together because the very
                // next thing after a apply needs to be leaving the
                // critical section
                await this.adapter.apply()
                await this.transactionHelper.endTransaction()
            }
            catch (ex) {
                 // Give the system a chance to recover
                 const recover = await this.adapter.error(ex)
                 if (!recover) throw ex
            }
        }
        else
            this.status?.warn(`Cannot ${this.action} ${this.adapter.resource.kind} ${this.adapter.resource.metadata.name} as it has been modified.`)
    }

    /**
     * Apply document to k8s.  Leave system to run provisioner xxxApply
     */
    async apply() {
        this.setStage('apply')

        // Pre-apply is performed however, Post-apply is NOT
        // when running local
        await this.adapter.preApply()

        // TODO: For remote, ensure that c6o-system
        // is installed and running
        let result
        switch (this.action) {
            case 'create':
                result = await this.cluster.create(this.adapter.resource)
                break
            case 'update':
                signalDocument(this.adapter.resource)
                result = await this.cluster.patch(this.adapter.resource, this.adapter.resource)
                break
            case 'remove':
                // update so that system has deprovision options set if any
                result = await this.cluster.upsert(this.adapter.resource)
                result.throwIfError()
                result = await this.cluster.delete(this.adapter.resource)
                break
        }
        result.throwIfError()
        return result.object
    }

    async perform(resource: Resource, action: actionType, answers?) {
        this.action = action

        try {
            this.status?.push(`Performing ${this.action} on ${resource.kind} ${resource.metadata.name}`)

            if (answers?.package) {
                // Override provisioner package to use local path
                resource.spec.provisioner.package = path.resolve(answers.package)
            }

            await this.load(resource)
            await this.inquire(answers)
            await this.validate()

            if (answers['spec-only'])
                return this.adapter.resource

            if (answers?.local) {
                return await this.applyLocal()
            } else {
                return await this.apply()
            }
        }
        catch (ex) {
            this.status?.error(ex)
            throw ex
        }
        finally {
            this.status?.pop()
            this.setStage('done')
        }
    }
}