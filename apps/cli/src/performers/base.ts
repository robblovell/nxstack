import * as inquirer from 'inquirer'
import { Resource, Result, Status } from '@c6o/kubeclient-contracts'
import { Reporter } from '../ui/display'
import { Cluster } from '@c6o/kubeclient/client'
import { ServiceList } from '@c6o/kubeclient-resources/lib/core/v1'
import { OrchestratorParams } from '../orchestrators'

export interface PerformerParams extends OrchestratorParams {
}

export abstract class Performer<O extends PerformerParams = PerformerParams> {
    status?: Status

    pause = (delay = 2000) => new Promise((resolve) => setTimeout(resolve, delay))

    constructor(protected _params: Partial<O> = {}, protected display?: Reporter) {
    }

    // Make params read only from external sources so that other performers can use this performer's ensures.
    // TODO: once ensure is separated, out this can go away.
    get params() { return this._params }

    async orchestrate(): Promise<void> {
        if (this.params.demo) {
            await this.demo()
        } else {
            await this.ensure()
            await this.perform()
        }
    }

    ensure(demo: boolean = false): Promise<void> {
        throw new Error('Ensure for command not implemented')
    }

    perform(): Promise<void> {
        throw new Error('Perform for command not implemented')
    }

    demo(): Promise<void> {
        throw new Error('Perform for command not implemented')
    }

    async prompt<T>(questions: inquirer.QuestionCollection<T>, initialAnswers?: T): Promise<T> {
        if (this.params.noInput) return initialAnswers
        return await inquirer.prompt(questions, initialAnswers)
    }
}
