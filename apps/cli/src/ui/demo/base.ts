import * as inquirer from 'inquirer'
import { Resource, Result, Status } from '@c6o/kubeclient-contracts'
import { Reporter } from '../display'
import { Cluster } from '@c6o/kubeclient'
import { ServiceList } from '@c6o/kubeclient-resources/core/v1'
import { OrchestratorParams } from '../../orchestrators'

export interface PerformerParams extends OrchestratorParams {
}

// TODO: this is a sketch and needs work. Currently not connected to anything.
export abstract class Demo<O extends PerformerParams = PerformerParams> {
    status?: Status

    pause = (delay = 2000) => new Promise((resolve) => setTimeout(resolve, delay))

    constructor(protected _params: Partial<O> = {}, protected display?: Reporter) {
    }

    // Make params read only from external sources so that other performers can use this performer's ensures.
    get params() { return this._params }

    demo(): Promise<void> {
        throw new Error('Perform for command not implemented')
    }

    async prompt<T>(questions: inquirer.QuestionCollection<T>, initialAnswers?: T): Promise<T> {
        // if (this.params.noInput) return initialAnswers
        return await inquirer.prompt(questions, initialAnswers)
    }

    // TODO: move this to a kubernetes performer layer?
    // Ensure helpers for kubernetes resources
    // generalized ensure for kubernetes resource picking.
    async ensureResourceParameter(helper, kind: string, namespace: string, name?: string | Array<string>): Promise<string> {
        const filter: Array<string> = Array.isArray(name) ? name : undefined
        name = (Array.isArray(name) ? undefined : name) as string
        const names = await this.findResources(helper, namespace, name)
        // don't move this above findResources because name can be undefined in the case of finding namespaces.
        const nameToFind: string = (name && !Array.isArray(name) ? name : namespace)
        // if this is a namespace, look for the namespace, not the name.
        if (names.find((aname: string) => aname === nameToFind)) return nameToFind
        // At this point we have a list of resources but don't know which one, ask the user if allowed.
        // if (this.params.noInput || this.params.quiet)
        //     throw new Error(name ? `${name} not found in the namespace ${namespace}.` : `Namespace ${namespace} not found.`)
        const filteredNames = filter? names.filter((name) => !filter.includes(name)) : names
        return await this.promptResource(nameToFind, filteredNames, kind)
    }

    async getResourceList(helper, namespace?: string, name?: string): Promise<Array<Resource>> {
        // Get a list of resources for this namespace,
        // name not given for namespaces.
        // namespace not given for top level resources.
        // TODO: a get of a resource list should be moved to the helper layer.
        const cluster = new Cluster()
        const template = helper.from(namespace, name).resource
        const result: Result = await cluster.list(template)
        result.throwIfError()
        const list = result.as<ServiceList>().items
        if (!list.length)
            throw new Error(`Could not find any resources in ${namespace}`)
        return list
    }

    async findResources(helper, namespace, name): Promise<Array<string>> {
        const list: Array<Resource> = await this.getResourceList(helper, namespace, name)
        return list.map(resource => resource.metadata.name)
    }

    // Generalized prompt for either choosing from a list, or in the case of an empty list, enter tha name.
    async promptForResource(promptText: string, resource: string, resourceChoices: Array<string> = []): Promise<string> {
        // if (this.params.noInput || this.params.quiet)
        //     return

        const response = await this.prompt([
            {
                name: 'resource',
                message: promptText,
                type: 'list',
                when: resourceChoices.length > 1,
                choices: _ => resourceChoices,
                default: 0
            },
            {
                name: 'resource',
                message: promptText,
                type: 'input',
                when: resourceChoices.length === 0,
            }
        ], (resourceChoices.length > 1) ? {} : { resource })
        return response.resource
    }

    // Make the prompt nicer if we didn't find the resource.
    resourcePrompt = (found: boolean, kind: string): string => {
        return (found ?
            `The ${kind} given was not found, please choose which ${kind} you want to debug:` :
            `Please choose which ${kind} you want to debug:`)
    }

    // Generalized prompt for a resource given a list of kubernetes resources (as strings)
    async promptResource(resource: string, resourceChoices: Array<string> = [], kind): Promise<string>{
        const prompt = this.resourcePrompt(!!resource, kind)
        resource = await this.promptForResource(prompt, resource, resourceChoices)
        return resource
    }
}
