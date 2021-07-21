import * as inquirer from 'inquirer'
import { Questions } from './contracts'
import { TerminalUIParams } from './params'
import { CLIReporter, DisplayClass, Reporter } from './display'

type questionsType<P> = Questions<P> | Promise<Questions<P>>
export class TerminalUI<P extends TerminalUIParams = TerminalUIParams> {

    readonly reporter: Reporter
    constructor(protected params?: P) {
        this.reporter = new CLIReporter(this.params)
    }


    async prompt(...questions: Array<questionsType<P> | void>): Promise<P> {
        if (this.params.noInput) return this.params
        const resolved = await Promise.all(questions.filter(q => q))
        const init: Array<Questions<P>> = []
        const prompts = resolved.reduce((all:  Questions<P>[], item) => {
            if (!item) return all
            if (Array.isArray(item)) {
                if (!item.length)
                    return all
                return all.concat(item)
            }
            all.push(item)
            return all
        }, init)
        return await inquirer.prompt(prompts, this.params)
    }

    list<K extends P[keyof P]>(
        items: K[],
        displayField: keyof K,
        header?: string,
        displayClass: DisplayClass = 'highlight') {

        this.listStrings(items.map(item => item[displayField as string]), header, displayClass)
    }

    listStrings(
        items: string[],
        header?: string,
        displayClass: DisplayClass = 'highlight') {
        if (header) {
            this.reporter.print(header, 'important')
            this.reporter.newline()
        }
        for(const item of items) {
            this.reporter.print('• ' + item, displayClass)
        }
    }

    async confirm(message: string, defaultValue = true) {
        if (this.params.noInput) return defaultValue

        const response = await inquirer.prompt({
            type: 'confirm',
            name: 'confirmPrompt',
            default: false,
            message
        })

        return !!response.confirmPrompt
    }

    async selectOne<K extends P[keyof P]>(
        items: K[],
        message: string,
        resultField: keyof P,
        displayField: keyof K
    ) {
        if (this.params.noInput) return items[0]
        return await inquirer.prompt([{
            type: 'list',
            message,
            name: resultField as string,
            when: (answers) => {
                if (items.length === 1)
                    answers[resultField] = items[0]
                return items.length > 1
            },
            choices: items.map(
                item => ({
                    name: item[displayField],
                    value: item
                })
            ),
            default: 0
        }])
    }
}
