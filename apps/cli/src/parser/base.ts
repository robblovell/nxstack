import Command, { flags } from '@oclif/command'
import * as Sentry from '@sentry/node'
import { createDebug } from '@c6o/logger'
import { CLIReporter } from '../ui/display'
import { Performer } from '../performers/base'
import { CLIStatus, TerminalUIParams } from '../ui'
import { endMetricsTransaction, startMetricsTransaction } from '../instrumentation/transaction'

const debug = createDebug()

/** @deprecated */
export type PerformerCreator<O> = new(signature: string) => Performer<O>

export abstract class BaseCommand<P extends TerminalUIParams = TerminalUIParams> extends Command {
    reporter: CLIReporter

    transaction: any
    params: P

    // implement this in any parse implementation.
    abstract go(): Promise<void>

    static flags = {
        'dry-run': flags.boolean({ hidden: true }),
        'demo': flags.boolean({ hidden: true }),
        'no-input': flags.boolean({ hidden: true }),
        help: flags.help({ hidden: true, char: 'h', description: 'Show help for this command' }),
        quiet: flags.boolean({ char: 'q', description: 'Only display error messages' })
    }

    // There are static and instance versions of flagMaps.
    static flagMaps = {
        'dry-run': 'dryRun',
        'no-input': 'noInput'
    }

    flagMaps = {
        ...BaseCommand.flagMaps
    }

    protected mapParams(source): P {
        return Object.keys(source).reduce((newSource, key) => {
            newSource[this.flagMaps[key] ? this.flagMaps[key] : key] = source[key]
            return newSource
        }, {}) as P
    }

    protected getParams() {
        const { flags, args } = this.parse((this as any).class)
        return this.mapParams({ ...args, ...flags as object })
    }

    async run() {
        this.params = this.getParams()
        // start metrics session
        await this.startMetricsTransaction()

        this.reporter = new CLIReporter(this.params, super.log, super.error)
        const cliStatus = new CLIStatus(this.reporter)
        this.params.status = cliStatus

        this.reporter.newline(2)

        await this.go()

        cliStatus.renderWarnings()

        this.reporter.newline(2)

        // end metrics session.
        await this.endMetricsTransaction()
    }

    async startMetricsTransaction() {
        this.transaction = await startMetricsTransaction(this.constructor.name)
    }

    async endMetricsTransaction() {
        await endMetricsTransaction(this.transaction)
    }

    async catch(err: any) {
        this.reporter?.newline()

        debug('error completed completed %o', err)
        Sentry.captureException(err)
        if (this.reporter)
            this.reporter.error(this.errorToMessage(err))
        else
            super.error(err)

        this.reporter.newline(2)
    }

    errorToMessage(err): string {
        switch(err.code) {
            case 401:
                return `You are not logged into the kubernetes cluster (${err.message})`
            default:
                return err.message || err
        }
    }
}
