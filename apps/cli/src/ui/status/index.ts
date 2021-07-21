import { Resource, Status } from '@c6o/kubeclient-contracts'
import { ProvisionerManager } from '@c6o/provisioner'
import * as DraftLog from 'draftlog'
import * as cliCursor from 'cli-cursor'
import { CLIReporter } from '../display'
import { CLIStage } from './stage'
import { getFeathers } from '../../factories/feathers'

/*
Every instance of CLIStatus will have a root, top-level stage under which all the
subsequent pushes to the stack will appear.
Use status.push() to create a new stage under the root, or add to the existing stage.
Use status.pop() to end a stage.

Example:
    const status = new CLIStatus(this.reporter)
    status.push('Doing cool things')
    try {
        status.push(`Fetching environment from ${params.source.type}`)
        await pause(2000)
        status.pop()
        status.push('Provisioning environment')
        await pause(2000)
        status.pop()
    } catch(ex) {
        status.error(ex, 'Things broke')
    } finally {
        status.pop()
    }
*/

export class CLIStatus extends Status {

    constructor(protected reporter: CLIReporter, protected manager?: ProvisionerManager) {
        super()
        DraftLog.into(console)

        this.manager?.on('apply', () => this.beginRender())
        this.manager?.on('done', () => this.endRender())
    }

    // Create Stages
    newStage = () => new CLIStage(this.reporter, this.manager)

    watchRemote(target: Resource): Promise<any> {
        // TODO: What should we do with the target passed in?
        const feathers = getFeathers()
        const appService = feathers.createService('api/apps')

        let resolve: any
        const promise = new Promise(r => resolve = r)

        appService.on('status', (data: any) => {
            if (data.done) {
                // Get one last render in
                this.stages.forEach( (stage: CLIStage) => stage.render())
                this.endRender()
                resolve()
            }
            else
                this.received(data.items)
        })

        if (!feathers.online) {
            this.reporter.newline()
            this.renderWarning(`Waiting for remote cloud at ${feathers.url}`)
        }

        this.beginRender()
        return promise
    }

    beginRender() {
        cliCursor.hide()
        this.renderWarnings()
        this.reporter.newline()
        // Tell all the old stages to start rendering
        this.stages.forEach((stage: CLIStage) => stage.beginRender())
    }

    endRender() {
        cliCursor.show()
        this.renderWarnings()
        this.renderErrors()
    }

    renderWarnings() {
        if (this.warnings?.length)
            this.reporter.newline()

        while (this.warnings.length) {
            const warning = this.warnings.pop()
            this.renderWarning(warning.message)
        }
    }

    renderErrors() {
        if (this.warnings.length)
            this.reporter.newline()

        while(this.errors.length) {
            const error = this.errors.pop()
            this.renderError(error.message)
        }
    }

    renderWarning(msg: string) {
        this.reporter.warn(msg)
    }

    renderError(msg: string) {
        this.reporter.error(msg)
    }
}